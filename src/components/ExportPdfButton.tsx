"use client";

import React, { useState } from "react";
import { MousePointer2 } from "lucide-react";

interface ExportPdfButtonProps {
  targetUrl: string | null;
  targetId?: string; // We can pass the ID of the dashboard, defaults to "dashboard-report"
}

export default function ExportPdfButton({ targetUrl, targetId = "dashboard-report" }: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const { toJpeg } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const element = document.getElementById(targetId);
      if (!element) throw new Error("Dashboard element not found");

      // Give React a tiny moment to settle before taking the picture
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 1. Capture the FULL height of the dashboard
      const dataUrl = await toJpeg(element, {
        quality: 1.0,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        width: element.scrollWidth,
        height: element.scrollHeight,
        // Filter out the buttons so they don't appear in the PDF
        filter: (node) => {
          if (node.classList?.contains("data-pdf-ignore")) return false;
          return true;
        },
        style: {
          animation: "none",
          transition: "none",
        },
      });

      // 2. Setup the A4 PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(dataUrl);
      const totalImgHeight = (imgProps.height * pdfPageWidth) / imgProps.width;

      // 3. The Multi-Page Loop
      let heightLeft = totalImgHeight;
      let position = 0;

      pdf.addImage(dataUrl, "JPEG", 0, position, pdfPageWidth, totalImgHeight);
      heightLeft -= pdfPageHeight;

      while (heightLeft > 0) {
        position = heightLeft - totalImgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "JPEG", 0, position, pdfPageWidth, totalImgHeight);
        heightLeft -= pdfPageHeight;
      }

      pdf.save(`SEO-Report-${targetUrl?.replace(/[^a-z0-9]/gi, "_") || "domain"}.pdf`);
    } catch (error) {
      console.error("PDF Export Failed:", error);
      alert("Failed to export PDF. Check the browser console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      disabled={isExporting}
      onClick={handleExport}
      className={`px-4 py-2 bg-muted border border-border rounded-lg text-xs font-bold text-foreground/70 hover:text-foreground hover:bg-muted/80 transition-all flex items-center gap-2 cursor-pointer ${
        isExporting ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <MousePointer2 size={14} />
      {isExporting ? "Generating PDF..." : "Export PDF"}
    </button>
  );
}