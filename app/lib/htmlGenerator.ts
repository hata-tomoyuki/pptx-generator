/**
 * PowerPointスライド用のHTMLを生成するためのOpenAI APIユーティリティ
 */

import { callOpenAI, type ChatMessage } from "./openaiClient";
import { PPTX_HTML_GENERATION_PROMPT } from "./constants/prompts";

/**
 * テーマと原稿テキストを指定してPowerPoint用のHTMLを生成する
 * @param theme - プレゼンテーションのテーマ
 * @param draftText - 原稿テキスト（スライドの元となる内容）
 * @param model - 使用するモデル（デフォルト: gpt-4o-mini）
 * @returns 生成されたHTML文字列
 */
export async function generateHtmlForPptx(
  theme: string,
  draftText: string = "",
  model: string = "gpt-4o-mini"
): Promise<string> {
  // システムプロンプトのプレースホルダーを置換
  let systemPrompt = PPTX_HTML_GENERATION_PROMPT.replace(/{{テーマ}}/g, theme);

  // 原稿テキストが指定されている場合は置換、ない場合は空文字列に置換
  const draftPlaceholder = draftText.trim() || "（原稿テキストは提供されていません。テーマに基づいて適切な内容を生成してください。）";
  systemPrompt = systemPrompt.replace(/{{原稿}}/g, draftPlaceholder);

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: draftText.trim()
        ? `テーマ「${theme}」と上記の原稿テキストをもとに、PPTXに変換しやすいHTML断片を生成してください。`
        : `テーマ「${theme}」について、PPTXに変換しやすいHTML断片を生成してください。`,
    },
  ];

  const response = await callOpenAI(messages, model);
  const htmlContent = response.choices[0]?.message?.content || "";

  // HTMLの断片のみを抽出（マークダウンコードブロックがあれば除去）
  let cleanedHtml = htmlContent.trim();

  // マークダウンコードブロックを除去
  if (cleanedHtml.startsWith("```")) {
    const lines = cleanedHtml.split("\n");
    // 最初の行（```htmlなど）と最後の行（```）を除去
    cleanedHtml = lines.slice(1, -1).join("\n").trim();
  }

  // JSX形式のstyle={{ ... }}を通常のHTML形式style="..."に変換
  cleanedHtml = convertJsxStyleToHtml(cleanedHtml);

  return cleanedHtml;
}

/**
 * JSX形式のstyle={{ ... }}を通常のHTML形式style="..."に変換
 * @param html - JSX形式のHTML文字列
 * @returns 通常のHTML形式の文字列
 */
function convertJsxStyleToHtml(html: string): string {
  // style={{ ... }}のパターンを検索して変換
  return html.replace(
    /style=\{\{([^}]+)\}\}/g,
    (match, styleContent) => {
      // オブジェクト形式のスタイルをCSS文字列に変換
      // "key": "value" または key: "value" の形式を key: value; に変換
      const cssString = styleContent
        .replace(/"([^"]+)":\s*"([^"]+)"/g, '$1: $2;')
        .replace(/([a-zA-Z-]+):\s*"([^"]+)"/g, '$1: $2;')
        .replace(/,/g, ' ')
        .trim();

      return `style="${cssString}"`;
    }
  );
}

