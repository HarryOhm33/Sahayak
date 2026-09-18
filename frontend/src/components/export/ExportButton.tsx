import { useState, useCallback } from "react";
import type { RecommendationResult } from "../../hooks/useRecommend";
import { generateReportPdf } from "./generatePdf";

interface ExportButtonProps {
  query: string;
  result: RecommendationResult;
}

type ExportState = "idle" | "loading" | "done" | "error";

export const ExportButton = ({ query, result }: ExportButtonProps) => {
  const [state, setState] = useState<ExportState>("idle");

  const handleExport = useCallback(async () => {
    if (state === "loading") return;

    setState("loading");
    try {
      await generateReportPdf(query, result);
      setState("done");
      setTimeout(() => setState("idle"), 2200);
    } catch (err) {
      console.error("[export] PDF generation failed:", err);
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  }, [query, result, state]);

  const label =
    state === "loading" ? "Generating…"
    : state === "done"    ? "Downloaded!"
    : state === "error"   ? "Failed"
    : "Export PDF";

  const icon =
    state === "loading" ? "ph-spinner animate-spin"
    : state === "done"    ? "ph-check-circle"
    : state === "error"   ? "ph-warning-circle"
    : "ph-cloud-arrow-down";

    const colorCls =
      state === "done"    ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : state === "error" ? "bg-red-500 text-white"
      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-blue-500";

  return (
    <button
      id="export-pdf-button"
      onClick={handleExport}
      disabled={state === "loading" || state === "error"}
      title="Export full standards report as PDF"
      className={[
        "flex items-center gap-2 px-3.5 py-2 rounded-[11px]",
        "text-[12px] font-medium uppercase tracking-wider",
        "transition-colors duration-200 focus:outline-none select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        colorCls,
      ].join(" ")}
    >
      <i className={`ph ${icon} text-[18px] mt-[-2px]`} />
      {label}
    </button>
  );
};
