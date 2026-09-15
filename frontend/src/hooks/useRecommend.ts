import { useState, useCallback } from "react";
import type { Standard } from "../types/standards";

export interface QueryAnalysis {
  originalQuery: string;
  parsedProduct: string;
  productCategory: string;
  ambiguityFlag: boolean;
  ambiguityNote: string | null;
}

export interface RecommendationResult {
  queryAnalysis: QueryAnalysis;
  standards: Standard[];
  grouped: Record<string, Standard[]>;
}

export type FetchStatus = "idle" | "loading" | "success" | "error";

interface UseRecommendReturn {
  status: FetchStatus;
  result: RecommendationResult | null;
  error: string | null;
  recommend: (query: string, file?: File | null) => Promise<void>;
  reset: () => void;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/recommend`;

export function useRecommend(): UseRecommendReturn {
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recommend = useCallback(async (query: string, file?: File | null) => {
    if (!query.trim()) return;

    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      let response: Response;

      if (file) {
        const form = new FormData();
        form.append("query", query.trim());
        form.append("file", file, file.name);

        response = await fetch(API_URL, {
          method: "POST",
          body: form,
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.trim() }),
        });
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error ??
            `Server returned HTTP ${response.status}`,
        );
      }

      const data = await response.json();

      const grouped = (data.standards as Standard[]).reduce<
        Record<string, Standard[]>
      >((acc, std) => {
        if (!acc[std.relationship]) acc[std.relationship] = [];
        acc[std.relationship].push(std);
        return acc;
      }, {});

      setResult({
        queryAnalysis: data.queryAnalysis,
        standards: data.standards,
        grouped,
      });
      setStatus("success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      console.error("[useRecommend] fetch failed:", msg);
      setError(msg);
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, recommend, reset };
}
