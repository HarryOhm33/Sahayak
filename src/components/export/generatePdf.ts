import type { jsPDF } from "jspdf";
import type { RecommendationResult, Standard } from "../../hooks/useRecommend";

// ─────────────────────────────────────────────────────────────────
// Design tokens (LaTeX / Academic Research Paper Style)
// ─────────────────────────────────────────────────────────────────
const C = {
  black: [0, 0, 0] as [number, number, number],
  gray:  [80, 80, 80] as [number, number, number], 
};

// Adjusted margins to increase content width
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 16; // Reduced to give more page width
const MARGIN_Y = 20;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const MAX_Y = PAGE_H - MARGIN_Y;

// ─────────────────────────────────────────────────────────────────
// Rendering Engine Helpers
// ─────────────────────────────────────────────────────────────────
function setFont(
  doc: jsPDF,
  size: number,
  style: "normal" | "bold" | "italic" | "bolditalic" = "normal",
  color = C.black
) {
  doc.setFontSize(size);
  doc.setFont("times", style);
  doc.setTextColor(...color);
}

function drawLine(doc: jsPDF, x: number, y: number, w: number, width = 0.2) {
  doc.setDrawColor(...C.black);
  doc.setLineWidth(width);
  doc.line(x, y, x + w, y);
}

function measureText(doc: jsPDF, text: string, maxWidth: number): number {
  if (!text) return 0;
  return doc.splitTextToSize(text, maxWidth).length;
}

function addText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeightMm: number,
  align: "left" | "center" | "right" | "justify" = "left"
): number {
  if (!text) return 0;
  const lines = doc.splitTextToSize(text, maxWidth);
  
  if (align === "center") {
    doc.text(lines, x, y, { align: "center" });
  } else if (align === "justify") {
    doc.text(lines, x, y, { align: "justify", maxWidth });
  } else if (align === "right") {
    doc.text(lines, x, y, { align: "right" });
  } else {
    doc.text(lines, x, y, { align: "left" });
  }
  
  return lines.length * lineHeightMm;
}

const RELATION_MAP: Record<string, string> = {
  primary: "Primary",
  normative: "Normative",
  testing: "Testing",
  safety: "Safety",
  installation: "Installation",
  related: "Related"
};

// ─────────────────────────────────────────────────────────────────
// SVG → PNG data-URL (browser canvas, high-DPI)
// ─────────────────────────────────────────────────────────────────
const PRODUCT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="#363636" viewBox="0 0 256 256"><path d="M32,104a8,8,0,0,1,8-8H56a8,8,0,0,1,0,16H40A8,8,0,0,1,32,104ZM71.43,58.75A8,8,0,0,0,82.75,47.43L71.43,36.12A8,8,0,0,0,60.12,47.43ZM128,40a8,8,0,0,0,8-8V16a8,8,0,0,0-16,0V32A8,8,0,0,0,128,40Zm50.91,21.09a8,8,0,0,0,5.66-2.34l11.31-11.32a8,8,0,0,0-11.31-11.31L173.25,47.43a8,8,0,0,0,5.66,13.66ZM192,104a8,8,0,0,0,8,8h16a8,8,0,0,0,0-16H200A8,8,0,0,0,192,104ZM88,112a8,8,0,0,0,8-8,32,32,0,0,1,64,0,8,8,0,0,0,16,0,48,48,0,0,0-96,0A8,8,0,0,0,88,112Zm55.2,24H112.8a4,4,0,0,0-3.91,3.15L102.62,168h50.76l-6.27-28.85A4,4,0,0,0,143.2,136ZM31.75,186,17,212.06a8,8,0,0,0,1.16,9.45,8.22,8.22,0,0,0,6,2.49H70.85a4,4,0,0,0,3.91-3.15l8-36.85H35.23A4,4,0,0,0,31.75,186Zm207.21,26-14.71-26a4,4,0,0,0-3.48-2H173.23l8,36.85a4,4,0,0,0,3.91,3.15h46.62a8.22,8.22,0,0,0,6-2.49A8,8,0,0,0,239,212.06Zm-28.27-50-12.42-22a8,8,0,0,0-7-4.06H167.76a4,4,0,0,0-3.91,4.85l5.9,27.15H207.2A4,4,0,0,0,210.69,162ZM88.24,136H64.7a8,8,0,0,0-7,4.06L45.31,162a4,4,0,0,0,3.49,6H86.25l5.9-27.15A4,4,0,0,0,88.24,136Zm68.62,48H99.14L91.5,219.15A4,4,0,0,0,95.41,224h65.18a4,4,0,0,0,3.91-4.85Z"></path></svg>`;

function svgToImageUrl(svgString: string, sizePx: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const dpr = 3; // high DPI for crisp rendering in PDF
    const canvas = document.createElement("canvas");
    canvas.width  = sizePx * dpr;
    canvas.height = sizePx * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) { reject(new Error("canvas 2d unavailable")); return; }
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("SVG load failed")); };
    img.src = url;
  });
}

// ─────────────────────────────────────────────────────────────────
// Main Export Function
// ─────────────────────────────────────────────────────────────────
export async function generateReportPdf(query: string, result: RecommendationResult): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });

  // Pre-render the product SVG icon to PNG before building the document
  let iconDataUrl: string | null = null;
  try {
    iconDataUrl = await svgToImageUrl(PRODUCT_SVG, 160);
  } catch {
    // Non-fatal — icon is decorative; proceed without it
    iconDataUrl = null;
  }
  
  let cursorY = 0;
  let pageNum = 1;

  function drawFooter() {
    const footerY = PAGE_H - 12;
    setFont(doc, 10, "normal", C.black);
    doc.text(`${pageNum}`, PAGE_W / 2, footerY, { align: "center" });
  }

  function addPage() {
    drawFooter();
    doc.addPage();
    pageNum++;
    cursorY = MARGIN_Y;
  }

  function checkPageBreak(neededMm: number) {
    if (cursorY + neededMm > MAX_Y) {
      addPage();
    }
  }

  function renderSectionHeading(title: string, align: "left" | "center" | "right" = "left") {
    checkPageBreak(15);
    cursorY += 8;
    setFont(doc, 12, "bold", C.black);
    
    if (align === "left") {
      doc.text(title.toUpperCase(), MARGIN_X, cursorY);
      const textW = doc.getTextWidth(title.toUpperCase());
      // Bold line under title, slightly longer than the text
      cursorY += 1.5;
      drawLine(doc, MARGIN_X, cursorY + 1.5, textW + 1, 0.5); 
    } else if (align === "center") {
      doc.text(title.toUpperCase(), PAGE_W / 2, cursorY, { align: "center" });
      const textW = doc.getTextWidth(title.toUpperCase());
      cursorY += 1.5;
      drawLine(doc, (PAGE_W - textW) / 2 - 3, cursorY + 1.5, textW + 1, 0.5); 
    } else {
      doc.text(title.toUpperCase(), PAGE_W - MARGIN_X, cursorY, { align: "right" });
      const textW = doc.getTextWidth(title.toUpperCase());
      cursorY += 1.5;
      drawLine(doc, PAGE_W - MARGIN_X - textW - 3, cursorY + 1.5, textW + 1, 0.5);
    }
    
    cursorY += 8;
  }

  // ── 1. Document Header (centered branding) ──
  cursorY = MARGIN_Y;

  // Icon — centered, 20mm square
  const iconSizeMm = 20;
  const iconX = (PAGE_W - iconSizeMm) / 2;
  if (iconDataUrl) {
    doc.addImage(iconDataUrl, "PNG", iconX, cursorY, iconSizeMm, iconSizeMm);
  }
  cursorY += iconDataUrl ? iconSizeMm + 5 : 0;
  cursorY += 3;

  // Main title — slightly bigger than before (18pt instead of 16pt)
  setFont(doc, 21.5, "bold", C.black);
  doc.text("Standards Compliance Report", PAGE_W / 2, cursorY, { align: "center" });
  cursorY += 8;

  // Date — centered
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  setFont(doc, 12.5, "normal", C.black);
  doc.text(`Generated by Sahayak Engine on ${dateStr}`, PAGE_W / 2, cursorY, { align: "center" });
  cursorY += 14;

  // ── 2. Query Analysis (Matching Image Design, text wrapping below) ──
  const qa = result.queryAnalysis;

  renderSectionHeading("I. Query Analysis", "left");
  cursorY += 5;

  
  // Product
  setFont(doc, 11, "bold", C.black);
  doc.text("Product:", MARGIN_X, cursorY);
  let w = doc.getTextWidth("Product: ");
  setFont(doc, 11, "normal", C.black);
  let linesH = addText(doc, qa.parsedProduct, MARGIN_X + w, cursorY, CONTENT_W - w, 5.5, "left");
  cursorY += linesH + 4;

  // Category
  setFont(doc, 11, "bold", C.black);
  doc.text("Category:", MARGIN_X, cursorY);
  w = doc.getTextWidth("Category: ");
  setFont(doc, 11, "normal", C.black);
  linesH = addText(doc, qa.productCategory, MARGIN_X + w, cursorY, CONTENT_W - w, 5.5, "left");
  cursorY += linesH + 4;

  // Original Query (Content pushed down to avoid left-side blank space)
  setFont(doc, 11, "bold", C.black);
  doc.text("Original Query:", MARGIN_X, cursorY);
  cursorY += 6; 
  setFont(doc, 11, "normal", C.black);
  linesH = addText(doc, qa.originalQuery, MARGIN_X, cursorY, CONTENT_W, 5.5, "justify");
  cursorY += linesH + 0;

  // Ambiguity Note
  if (qa.ambiguityFlag && qa.ambiguityNote) {
    setFont(doc, 11, "bold", C.black);
    doc.text("Ambiguity Note:", MARGIN_X, cursorY);
    cursorY += 6;
    setFont(doc, 11, "normal", C.black);
    linesH = addText(doc, qa.ambiguityNote, MARGIN_X, cursorY, CONTENT_W, 5.5, "justify");
    cursorY += linesH + 6;
  }

  // ── 3. Summary Table ──
  renderSectionHeading("II. Recommended Standards Summary", "left");

  const colX = { num: MARGIN_X, title: MARGIN_X + 40, ed: MARGIN_X + 130, type: MARGIN_X + 148, score: PAGE_W - MARGIN_X };
  const colW = { num: 37, title: 85, ed: 15, type: 15, score: 8 };
  
  cursorY += 5;
  
  setFont(doc, 11, "bold", C.black);
  doc.text("IS Number", colX.num, cursorY);
  doc.text("Title", colX.title, cursorY);
  doc.text("Ed.", colX.ed, cursorY);
  doc.text("Type", colX.type, cursorY);
  doc.text("Match", colX.score, cursorY, { align: "right" });
  
  cursorY += 4;
  // Mid Rule (Light)
  drawLine(doc, MARGIN_X, cursorY, CONTENT_W, 0.15);
  cursorY += 8;

  for (const std of result.standards) {
    setFont(doc, 11, "normal", C.black);
    const titleLines = measureText(doc, std.title, colW.title);
    const numLines = measureText(doc, std.number, colW.num);
    const lh = 5;
    const maxLines = Math.max(titleLines, numLines, 1);
    const rowH = (maxLines * lh);

    checkPageBreak(rowH + 5);

    addText(doc, std.number, colX.num, cursorY, colW.num, lh);
    addText(doc, std.title, colX.title, cursorY, colW.title, lh);
    doc.text(std.edition, colX.ed, cursorY);
    doc.text(RELATION_MAP[std.relationship] ?? std.relationship, colX.type, cursorY);

    if (std.relevance != null) {
      doc.text(`${std.relevance}%`, colX.score, cursorY, { align: "right" });
    }

    cursorY += rowH + 2;
  }
  

  cursorY += 4;
  
  // ── 4. Detailed Analysis Sections ──
  renderSectionHeading("III. Detailed Standard Analysis", "left");
  cursorY += 5;

  result.standards.forEach((std, index) => {
    checkPageBreak(40);

    const isPrimary = std.relationship === "primary";
    
        // Metadata
    setFont(doc, 11, "normal", C.gray);
    let metaText = `Edition: ${std.edition}   |   Status: ${std.status.charAt(0).toUpperCase() + std.status.slice(1)}`;
    if (std.relevance != null) {
      metaText += `   |   Relevance: ${std.relevance}%`;
    }
    doc.text(metaText, MARGIN_X, cursorY);
    cursorY += 7;

    // Numbering: 1, 2, 3... (Bold)
    const listNum = `${index + 1}.`;
    setFont(doc, 12, "bold", C.black);
    doc.text(listNum, MARGIN_X, cursorY);
    const numWidth = doc.getTextWidth(listNum + " ");

    // Standard Label & Type (Normal/Less Bold)
    setFont(doc, 12, "bold", C.black); 
    const typeLabel = isPrimary ? "Primary Standard" : `${RELATION_MAP[std.relationship] ?? std.relationship} Reference`;
    doc.text(`${std.number} — ${typeLabel}`, MARGIN_X + numWidth, cursorY);
    cursorY += 6.5;

    // Title 
    setFont(doc, 11, "italic", C.black);
    const titleH = addText(doc, std.title, MARGIN_X, cursorY, CONTENT_W, 5.5, "left");
    cursorY += titleH - 3.35;

      // Mid Rule (Light)
  drawLine(doc, MARGIN_X, cursorY, CONTENT_W, 0.15);
  cursorY += 6;


    // AI Analysis (Body Text)
    setFont(doc, 11, "normal", C.black);
    const analysisH = addText(doc, std.description, MARGIN_X, cursorY, CONTENT_W, 5.5, "justify");
    cursorY += analysisH + 2;

    // Gap Analysis
    if (std.missingParams && std.missingParams.length > 0) {
      checkPageBreak(15);
      setFont(doc, 11, "bold", C.black);
      doc.text("Gap Analysis:", MARGIN_X, cursorY);
      cursorY += 6;

      std.missingParams.forEach((param) => {
        setFont(doc, 11, "normal", C.black);
        const prefix = "• ";
        const prefixW = doc.getTextWidth(prefix);
        const paramW = CONTENT_W - prefixW - 5;
        
        const lines = measureText(doc, param, paramW);
        checkPageBreak(lines * 5.5 + 5);
        
        doc.text(prefix, MARGIN_X + 5, cursorY);
        addText(doc, param, MARGIN_X + 5 + prefixW, cursorY, paramW, 5.5, "justify");
        cursorY += (lines * 5.5) + 1.5;
      });
      cursorY += 3;
    }

    // Certifications
    if (std.certifications && std.certifications.length > 0) {
      checkPageBreak(20);
      setFont(doc, 11, "bold", C.black);
      doc.text("Certifications:", MARGIN_X, cursorY);
      cursorY += 6;

      for (const cert of std.certifications) {
        checkPageBreak(10);
        setFont(doc, 11, "normal", C.black);
        const certText = `• ${cert.name} [${cert.status}]`;
        const certH = addText(doc, certText, MARGIN_X + 5, cursorY, CONTENT_W - 10, 5.5);
        cursorY += certH + 1.5;
      }
      cursorY += 3;
    }

    // Amendments
    if (std.amendments && std.amendments.length > 0) {
      checkPageBreak(15);
      setFont(doc, 12, "bold", C.black);
      doc.text("Amendments:", MARGIN_X, cursorY);
      cursorY += 8;

      for (const amend of std.amendments) {
        checkPageBreak(8);
        setFont(doc, 11, "normal", C.black);
        const amendH = addText(doc, `• ${amend.label}`, MARGIN_X + 5, cursorY, CONTENT_W - 10, 5.5);
        cursorY += amendH + 1.5;
      }
      cursorY += 3;
    }

    cursorY += 7.5; // Extra spacing between standards
    // // Add visual separation border between standards (except the very last one)
    // if (index < result.standards.length - 1) {
    //   cursorY += 5;
    //   drawLine(doc, MARGIN_X + 20, cursorY, CONTENT_W - 40, 0.1); 
    //   cursorY += 10;
    // } else {
    //   cursorY += 8;
    // }
  });

  // Draw final footer
  drawFooter();

  // Save PDF
  const safeName = query.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  doc.save(`sahayak-report-${safeName}.pdf`);
}