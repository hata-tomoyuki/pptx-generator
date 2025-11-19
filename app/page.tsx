"use client";

import { useRef } from "react";

import PptxGenJS from "pptxgenjs";

export default function HomePage() {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleExportPptx = async () => {
    if (!contentRef.current) return;

    const pptx = new PptxGenJS();

    // ---- ここから HTML → PPTX の簡易変換ルール ----

    const title = contentRef.current.querySelector("h1")?.textContent ?? "";

    const paragraphs = Array.from(
      contentRef.current.querySelectorAll("p")
    ).map((p) => p.textContent ?? "");

    const slide = pptx.addSlide();

    // タイトル
    slide.addText(title || "No title", {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 32,
      bold: true,
    });

    // 本文（pタグをまとめて1つのテキストに）
    slide.addText(paragraphs.join("\n"), {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 4,
      fontSize: 18,
    });

    // ファイルとしてダウンロード
    await pptx.writeFile({ fileName: "from-html-nextjs.pptx" });
  };

  return (
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

        <p>ここにある段落は、PPTXの1つのテキストボックスにまとめて出力されます。</p>
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
  );
}
