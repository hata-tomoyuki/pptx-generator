"use client";

import { useRef } from "react";
import { buildPptxFromHtml } from "./lib/htmlToPptx";
import { OpenAIExample } from "./lib/openaiExample";

export default function HomePage() {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleExportPptx = async () => {
    if (!contentRef.current) return;

    const pptx = buildPptxFromHtml(contentRef.current);
    await pptx.writeFile({ fileName: "from-html-nextjs.pptx" });
  };

  return (
    <>
      <main style={{ padding: "24px" }}>
        <h2>HTML → PPTX 変換デモ（Next.js）</h2>

        {/* ここにあるHTMLをPPTXに変換する */}
        <div
          ref={contentRef}
          style={{
            border: "1px solid #ddd",
            padding: "16px",
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          <h1>サンプルタイトル：売上レポート</h1>

          <p>これはサンプルの本文です。HTMLからPPTXに変換するデモです。</p>

          <h2>主な特徴</h2>

          <ul>
            <li>箇条書きのサポート</li>
            <li>表の変換</li>
            <li>画像の埋め込み</li>
            <li>見出しの階層構造</li>
          </ul>

          <h3>詳細情報</h3>

          <p>このデモでは、<strong>太字</strong>や<em>斜体</em>などのテキストスタイルも対応しています。</p>

          <h2>売上データ</h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>月</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>売上</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>成長率</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>1月</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>100万円</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>+10%</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>2月</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>120万円</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>+20%</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>3月</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>150万円</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>+25%</td>
              </tr>
            </tbody>
          </table>

          <h2>今後の予定</h2>

          <ol>
            <li>新機能の開発</li>
            <li>パフォーマンスの改善</li>
            <li>ユーザーフィードバックの反映</li>
          </ol>

          <p>以上が、PPTXでよく使われる要素のサンプルです。</p>
        </div>

        <button
          onClick={handleExportPptx}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          PPTXをダウンロード
        </button>
      </main>
      {/* <OpenAIExample /> */}
    </>
  );
}
