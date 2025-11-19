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
<h1 style={{ textAlign: "center", fontSize: "24px" }}>売上レポート</h1>

<h2 style={{ fontSize: "20px" }}>導入</h2>
<p style={{ lineHeight: "1.6" }}>本レポートでは、昨年度の売上データを分析し、成長の要因と今後の戦略を提案します。特に、売上の増加傾向や重要な指標を強調します。</p>

<h2 style={{ fontSize: "20px" }}>特徴</h2>
<ul style={{ lineHeight: "1.6" }}>
  <li>売上全体のトレンド分析</li>
  <li>部門別のパフォーマンス比較</li>
  <li>市場シェアの変化</li>
</ul>

<h3 style={{ fontSize: "18px" }}>主要データの概要</h3>
<p style={{ lineHeight: "1.6" }}>売上の動向は、業界全体の成長を反映しています。特に、<strong>第2四半期</strong>における売上の増加が顕著です。</p>

<table style={{ borderCollapse: "collapse", width: "100%" }}>
  <thead>
    <tr>
      <th style={{ border: "1px solid #ddd", padding: "8px" }}>四半期</th>
      <th style={{ border: "1px solid #ddd", padding: "8px" }}>売上（万円）</th>
      <th style={{ border: "1px solid #ddd", padding: "8px" }}>対前年増減率</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}>第1四半期</td>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}>500</td>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}><em>+5%</em></td>
    </tr>
    <tr>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}>第2四半期</td>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}>700</td>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}><em>+10%</em></td>
    </tr>
    <tr>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}>第3四半期</td>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}>600</td>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}><em>-3%</em></td>
    </tr>
    <tr>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}>第4四半期</td>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}>800</td>
      <td style={{ border: "1px solid #ddd", padding: "8px" }}><em>+15%</em></td>
    </tr>
  </tbody>
</table>

<h2 style={{ fontSize: "20px" }}>今後の予定</h2>
<ol style={{ lineHeight: "1.6" }}>
  <li>次回の売上計画を策定する</li>
  <li>新規市場の調査を行う</li>
  <li>顧客対応の改善策を実施する</li>
</ol>

<p style={{ lineHeight: "1.6" }}>これらの施策により、売上のさらなる向上を目指します。</p>
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
      <OpenAIExample />
    </>
  );
}
