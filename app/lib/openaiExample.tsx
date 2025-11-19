"use client";

import { useState, useRef } from "react";
import { generateHtmlForPptx } from "./htmlGenerator";
import { buildPptxFromHtml } from "./htmlToPptx";

/**
 * OpenAI APIを使用してPowerPoint用のHTMLを生成し、PPTXに変換するコンポーネント
 */
export function OpenAIExample() {
  const [theme, setTheme] = useState<string>("売上レポート");
  const [generatedHtml, setGeneratedHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const htmlContainerRef = useRef<HTMLDivElement | null>(null);

  const handleGenerateHtml = async () => {
    if (!theme.trim()) {
      setError("テーマを入力してください");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedHtml("");

    try {
      const html = await generateHtmlForPptx(theme);
      setGeneratedHtml(html);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPptx = async () => {
    if (!htmlContainerRef.current) {
      setError("HTMLが生成されていません");
      return;
    }

    try {
      const pptx = buildPptxFromHtml(htmlContainerRef.current);
      const fileName = theme.trim()
        ? `${theme.replace(/[^\w\s-]/g, "").trim() || "presentation"}.pptx`
        : "presentation.pptx";
      await pptx.writeFile({ fileName });
    } catch (err) {
      setError(err instanceof Error ? err.message : "PPTXの生成に失敗しました");
    }
  };

  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", marginTop: "16px" }}>
      <h3>AIでHTML生成（PowerPoint用）</h3>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          テーマ:
        </label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="例: 売上レポート、新商品発表、プロジェクト計画..."
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleGenerateHtml}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: loading ? "#ccc" : "#0070f3",
            color: "white",
          }}
        >
          {loading ? "生成中..." : "HTMLを生成"}
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: "8px", marginBottom: "8px" }}>
          エラー: {error}
        </div>
      )}

      {generatedHtml && (
        <>
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong>生成されたHTML:</strong>
              <button
                onClick={handleDownloadPptx}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#28a745",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                PPTXとしてダウンロード
              </button>
            </div>

            {/* プレビュー用のコンテナ（PPTX変換用） */}
            <div
              ref={htmlContainerRef}
              style={{ display: "none" }}
              dangerouslySetInnerHTML={{ __html: generatedHtml }}
            />

            {/* HTMLプレビュー */}
            <div
              style={{
                marginTop: "8px",
                padding: "12px",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
              dangerouslySetInnerHTML={{ __html: generatedHtml }}
            />

            {/* HTMLコード表示 */}
            <details style={{ marginTop: "12px" }}>
              <summary style={{ cursor: "pointer", fontWeight: "bold", marginBottom: "8px" }}>
                HTMLコードを表示
              </summary>
              <pre
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  overflow: "auto",
                  maxHeight: "400px",
                  fontSize: "12px",
                }}
              >
                {generatedHtml}
              </pre>
            </details>
          </div>
        </>
      )}
    </div>
  );
}

