import { useMemo, useCallback } from "react";
import type { Node, Edge } from "reactflow";
import type { Standard } from "../types/standards";
import {
  QUERY_TO_PRIMARY_GAP,
  SIDEBAR_WIDTH,
  CARD_HEIGHT_EST,
  NODE_HEADER_H,
  CHILD_NODE_GAP,
  PRIMARY_TO_CHILD_GAP,
} from "../constants/layout";


interface UseGraphLayoutOptions {
  appState: "idle" | "loading" | "results" | "error";
  input: string;
  queryNodeY: number;
  queryNodeHeight: number;
  sidebarOpen: boolean;
  groupedStandards: Record<string, Standard[]>;
  attachedFile: File | null;
  onSearch: (query: string, file?: File | null) => void;
  onFileChange: (file: File | null) => void;
  onHeightChange: (h: number) => void;
  onNodeSelect: (id: string) => void;
}

interface GraphLayout {
  nodes: Node[];
  edges: Edge[];
}


function isTwoCol(isPrimary: boolean, count: number): boolean {
  return isPrimary ? count >= 2 : count > 3;
}


function nodeWidth(isPrimary: boolean, count: number): number {
  return isTwoCol(isPrimary, count) ? 600 : 300;
}

function nodeHeight(isPrimary: boolean, count: number): number {
  if (count === 0) return NODE_HEADER_H + CARD_HEIGHT_EST;
  const cols = isTwoCol(isPrimary, count) ? 2 : 1;
  const rows = Math.ceil(count / cols);
  return NODE_HEADER_H + rows * CARD_HEIGHT_EST;
}

// Canonical order for secondary relationship groups
const RELATION_ORDER = [
  "normative",
  "testing",
  "safety",
  "installation",
  "related",
] as const;

const RELATION_LABELS: Record<string, string> = {
  normative: "Normative References",
  testing: "Testing Standards",
  safety: "Safety Standards",
  installation: "Installation Codes",
  related: "Related Standards",
};


export const useGraphLayout = ({
  appState,
  input,
  queryNodeY,
  queryNodeHeight,
  sidebarOpen,
  groupedStandards,
  attachedFile,
  onSearch,
  onFileChange,
  onHeightChange,
  onNodeSelect,
}: UseGraphLayoutOptions): GraphLayout => {
  const stableOnSearch = useCallback(onSearch, []);
  const stableOnHeightChange = useCallback(onHeightChange, []);

  return useMemo<GraphLayout>(() => {
    const sidebarOffset = sidebarOpen ? SIDEBAR_WIDTH : 0;
    const centerX = (window.innerWidth - sidebarOffset) / 2;

    const nodes: Node[] = [
      {
        id: "node-query",
        type: "queryNode",
        position: { x: centerX - 220, y: queryNodeY },
        data: {
          query: input,
          attachedFile,
          onSearch: stableOnSearch,
          onFileChange,
          onHeightChange: stableOnHeightChange,
          isIdle: appState === "idle",
          isLoading: appState === "loading",
        },
      },
    ];

    const edges: Edge[] = [];

    if (appState !== "results" || Object.keys(groupedStandards).length === 0) {
      return { nodes, edges };
    }


    const primaryStds = groupedStandards["primary"] ?? [];
    const primaryCount = primaryStds.length;
    const primW = nodeWidth(true, primaryCount);
    const primH = nodeHeight(true, primaryCount);
    const primaryX = centerX - primW / 2;
    const primaryY = queryNodeY + queryNodeHeight + QUERY_TO_PRIMARY_GAP;

    nodes.push({
      id: "group-primary",
      type: "groupNode",
      position: { x: primaryX, y: primaryY },
      data: {
        type: "primary",
        title: "Primary Standards",
        standards: primaryStds,
        id: "group-primary",
        onSelect: onNodeSelect,
      },
    });

    edges.push({
      id: "edge-query-primary",
      source: "node-query",
      target: "group-primary",
      type: "default",
      style: { stroke: "#c2c2c2", strokeWidth: 1 },
    });


    const childRels = RELATION_ORDER.filter(
      (r) => (groupedStandards[r]?.length ?? 0) > 0
    );

    if (childRels.length === 0) return { nodes, edges };

    const childY = primaryY + primH + PRIMARY_TO_CHILD_GAP;

    const childWidths = childRels.map((r) =>
      nodeWidth(false, groupedStandards[r].length)
    );
    const totalChildWidth =
      childWidths.reduce((sum, w) => sum + w, 0) +
      (childRels.length - 1) * CHILD_NODE_GAP;

    let cursorX = centerX - totalChildWidth / 2;

    childRels.forEach((rel, idx) => {
      const groupId = `group-${rel}`;
      const stds = groupedStandards[rel];
      const w = childWidths[idx];

      nodes.push({
        id: groupId,
        type: "groupNode",
        position: { x: cursorX, y: childY },
        data: {
          type: rel,
          title: RELATION_LABELS[rel] ?? rel,
          standards: stds,
          id: groupId,
          onSelect: onNodeSelect,
        },
      });

      edges.push({
        id: `edge-primary-${groupId}`,
        source: "group-primary",
        target: groupId,
        type: "default",
        style: { stroke: "#c2c2c2", strokeWidth: 1 },
      });

      cursorX += w + CHILD_NODE_GAP;
    });

    return { nodes, edges };
  }, [
    appState,
    input,
    queryNodeY,
    queryNodeHeight,
    sidebarOpen,
    groupedStandards,
    attachedFile,
    onFileChange,
    onNodeSelect,
    stableOnSearch,
    stableOnHeightChange,
  ]);
};
