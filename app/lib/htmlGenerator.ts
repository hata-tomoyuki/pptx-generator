/**
 * PowerPointスライド用のHTMLを生成するためのOpenAI APIユーティリティ
 */

import { callOpenAI, type ChatMessage } from "./openaiClient";

/**
 * システムプロンプト（テーマ部分は後で置換）
 */
const SYSTEM_PROMPT = `あなたは PowerPoint スライドの元になる HTML（JSX互換）を生成するアシスタントです。

これから指定するテーマについて、PPTX に変換しやすい構造の HTML 断片を出力してください。

# テーマ

- テーマ: 「{{テーマ}}」

# 出力形式（重要）

- 出力は **HTML/JSX 断片のみ** とし、説明文やコメントは一切含めないでください。

- \`<html>\`, \`<head>\`, \`<body>\`, \`<div>\` などのラッパー要素は出力しないでください。

- 次の要素を必ず含めてください:

  - \`<h1>\` … 全体タイトル（1つ）

  - \`<h2>\` … セクション（最低 2 セクション以上）

  - \`<h3>\` … 小見出し（1つ以上）

  - \`<p>\` … 各セクション本文

  - \`<ul><li>\` … 箇条書き

  - \`<ol><li>\` … 手順

  - \`<table>\`（\`<thead>\` \`<tbody>\` 含む、3〜5行）

  - \`<strong>\` と \`<em>\` … 重要語句強調

# スタイル仕様（必須）

- \`style={{ ... }}\` のように **React/JSX形式** で記述してください。

  - 例: \`style={{ border: "1px solid #ddd", padding: "8px" }}\`

- 可能ならすべての \`<td>\`, \`<th>\` に最小限の枠線と余白を付与してください。

- オブジェクト内は **ダブルクォート** を使用し、CSSキーはキャメルケースにしないで構いません（例: \`"border": "1px solid #ddd"\`）。

# コンテンツ構造（例）

1. \`<h1>\`：プレゼン全体タイトル

2. 導入セクション（\`<h2>\` + \`<p>\`）

3. 特徴セクション（\`<ul>\`）

4. 詳細情報（\`<h3>\` + \`<p>\` + \`<strong>\` / \`<em>\`）

5. データ表（\`<table>\`）

6. 今後の予定（\`<ol>\`）

7. 終わりのまとめ \`<p>\`

# 文体・トーン

- 日本語・ビジネス調

- 各セクション 1〜3文

- テーマに合った具体的内容にする

# 禁止事項

- 「以下HTMLです」「\`\`\`html」などのメタ文を付けない

- \`<script>\` \`<style>\` を出力しない

- 外部リンクURLを含めない（画像は \`<img alt="..." />\` で可）

以上の条件を満たした、PPTXに変換しやすい HTML/JSX 断片のみを出力してください。`;

/**
 * テーマを指定してPowerPoint用のHTMLを生成する
 * @param theme - プレゼンテーションのテーマ
 * @param model - 使用するモデル（デフォルト: gpt-4o-mini）
 * @returns 生成されたHTML文字列
 */
export async function generateHtmlForPptx(
  theme: string,
  model: string = "gpt-4o-mini"
): Promise<string> {
  // システムプロンプトのテーマ部分を置換
  const systemPrompt = SYSTEM_PROMPT.replace(/{{テーマ}}/g, theme);

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: `テーマ「${theme}」について、PPTXに変換しやすいHTML断片を生成してください。`,
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

