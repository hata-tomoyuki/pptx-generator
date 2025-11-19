import PptxGenJS from "pptxgenjs";

/**
 * HTML要素からPPTXプレゼンテーションを生成する
 * @param root - HTMLルート要素
 * @returns 生成されたPPTXインスタンス
 */
export function buildPptxFromHtml(root: HTMLElement): PptxGenJS {
  const pptx = new PptxGenJS();

  const title = root.querySelector("h1")?.textContent ?? "";
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

  // すべての要素を収集して順序を保持
  const allElements: Array<{ type: string; element: Element }> = [];
  root.querySelectorAll("h2, h3, p, ul, ol, table, img").forEach((el) => {
    allElements.push({
      type: el.tagName.toLowerCase(),
      element: el,
    });
  });

  // 順序に従って処理
  for (const { type, element } of allElements) {
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

  return pptx;
}

