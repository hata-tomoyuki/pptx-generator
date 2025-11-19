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

    let slide = pptx.addSlide();

    let currentY = 0.5;

    // タイトル
    if (title) {
      slide.addText(title, {
        x: 0.5,
        y: currentY,
        w: 9,
        h: 0.8,
        fontSize: 32,
        bold: true,
      });
      currentY += 1;
    }

    // 各要素を順番に配置
    let elementIndex = 0;
    const allElements: Array<{
      type: string;
      element: Element;
      order: number;
    }> = [];

    // すべての要素を収集して順序を保持
    contentRef.current.querySelectorAll("h2, h3, p, ul, ol, table, img").forEach(
      (el) => {
        allElements.push({
          type: el.tagName.toLowerCase(),
          element: el,
          order: elementIndex++,
        });
      }
    );

    // 順序に従って処理
    for (const item of allElements) {
      const { type, element } = item;

      if (type === "h2") {
        slide.addText(element.textContent || "", {
          x: 0.5,
          y: currentY,
          w: 9,
          h: 0.6,
          fontSize: 24,
          bold: true,
          color: "363636",
        });
        currentY += 0.7;
      } else if (type === "h3") {
        slide.addText(element.textContent || "", {
          x: 0.5,
          y: currentY,
          w: 9,
          h: 0.5,
          fontSize: 20,
          bold: true,
          color: "555555",
        });
        currentY += 0.6;
      } else if (type === "p") {
        const text = element.textContent || "";
        if (text.trim()) {
          // テキスト内のスタイルを処理（簡易版）
          const hasBold = element.querySelector("strong, b");
          const hasItalic = element.querySelector("em, i");

          slide.addText(text, {
            x: 0.5,
            y: currentY,
            w: 9,
            h: 0.4,
            fontSize: 16,
            bold: !!hasBold,
            italic: !!hasItalic,
          });
          currentY += 0.5;
        }
      } else if (type === "ul" || type === "ol") {
        const listItems = element.querySelectorAll("li");
        const bulletPoints = Array.from(listItems).map((li) => ({
          text: li.textContent || "",
          options: {
            bullet: true,
            bulletType: type === "ol" ? "number" : "bullet",
          },
        }));

        if (bulletPoints.length > 0) {
          slide.addText(bulletPoints, {
            x: 0.5,
            y: currentY,
            w: 9,
            h: Math.min(bulletPoints.length * 0.4, 3),
            fontSize: 16,
          });
          currentY += Math.min(bulletPoints.length * 0.4 + 0.2, 3.2);
        }
      } else if (type === "table") {
        const rows = element.querySelectorAll("tr");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tableData: any[] = [];

        rows.forEach((row) => {
          const cells = row.querySelectorAll("td, th");
          const rowData = Array.from(cells).map((cell) => ({
            text: cell.textContent || "",
            options: {
              bold: cell.tagName === "TH",
            },
          }));
          if (rowData.length > 0) {
            tableData.push(rowData);
          }
        });

        if (tableData.length > 0) {
          slide.addTable(tableData, {
            x: 0.5,
            y: currentY,
            w: 9,
            h: Math.min(tableData.length * 0.5, 3),
            fontSize: 14,
            border: { type: "solid", color: "CCCCCC", pt: 1 },
            fill: { color: "F5F5F5" },
            align: "left",
            valign: "middle",
          });
          currentY += Math.min(tableData.length * 0.5 + 0.3, 3.3);
        }
      } else if (type === "img") {
        const img = element as HTMLImageElement;
        const src = img.src;
        const alt = img.alt || "";

        // 画像のサイズを取得（デフォルト値）
        const width = img.width || 4;
        const height = img.height || 3;

        try {
          // 画像を追加（base64またはURLから）
          if (src.startsWith("data:")) {
            // base64画像
            slide.addImage({
              data: src,
              x: 0.5,
              y: currentY,
              w: Math.min(width / 100, 4),
              h: Math.min(height / 100, 3),
            });
          } else if (src.startsWith("http")) {
            // 外部URL（CORS対応が必要な場合あり）
            slide.addImage({
              path: src,
              x: 0.5,
              y: currentY,
              w: Math.min(width / 100, 4),
              h: Math.min(height / 100, 3),
            });
          }
          currentY += Math.min(height / 100 + 0.2, 3.2);
        } catch {
          // 画像の読み込みに失敗した場合はテキストで代替
          slide.addText(`[画像: ${alt || "画像読み込みエラー"}]`, {
            x: 0.5,
            y: currentY,
            w: 4,
            h: 0.3,
            fontSize: 12,
            color: "999999",
          });
          currentY += 0.4;
        }
      }

      // スライドの高さを超えた場合は新しいスライドを作成
      if (currentY > 6.5) {
        const newSlide = pptx.addSlide();
        slide = newSlide;
        currentY = 0.5;
      }
    }

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
  );
}
