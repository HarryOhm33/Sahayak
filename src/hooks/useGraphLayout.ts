import { useMemo, useCallback } from "react";
import type { Node, Edge } from "reactflow";
import type { Standard } from "../types/standards";
import {
  QUERY_TO_PRIMARY_GAP,
  CHILD_NODE_WIDTH,
  CHILD_NODE_GAP,
  CHILD_NODE_Y_OFFSET,
  SIDEBAR_WIDTH,
} from "../constants/layout";

interface UseGraphLayoutOptions {
  appState: "idle" | "loading" | "results" | "error";
  input: string;
  queryNodeY: number;
  queryNodeHeight: number;
  sidebarOpen: boolean;
  groupedStandards: Record<string, Standard[]>;
  onSearch: (query: string) => void;
  onHeightChange: (h: number) => void;
  onNodeSelect: (id: string) => void;
}

interface GraphLayout {
  nodes: Node[];
  edges: Edge[];
}

export const useGraphLayout = ({
  appState,
  input,
  queryNodeY,
  queryNodeHeight,
  sidebarOpen,
  groupedStandards,
  onSearch,
  onHeightChange,
  onNodeSelect,
}: UseGraphLayoutOptions): GraphLayout => {
  const stableOnSearch = useCallback(onSearch, []);
  const stableOnHeightChange = useCallback(onHeightChange, []);

  return useMemo<GraphLayout>(() => {
    const sidebarWidth = sidebarOpen ? SIDEBAR_WIDTH : 0;
    const centerX = (window.innerWidth - sidebarWidth) / 2;
    const primaryNodeY = queryNodeY + queryNodeHeight + QUERY_TO_PRIMARY_GAP;

    const nodes: Node[] = [
      {
        id: "node-query",
        type: "queryNode",
        position: { x: centerX - 220, y: queryNodeY },
        data: {
          query: input,
          onSearch: stableOnSearch,
          onHeightChange: stableOnHeightChange,
          isIdle: appState === "idle",
          isLoading: appState === "loading",
        },
      },
    ];

    const edges: Edge[] = [];

    if (appState === "results" && Object.keys(groupedStandards).length > 0) {
      nodes.push({
        id: "group-primary",
        type: "groupNode",
        position: { x: centerX - 160, y: primaryNodeY },
        data: {
          type: "primary",
          title: "Primary Target",
          standards: groupedStandards["primary"] ?? [],
          id: "group-primary",
          onSelect: onNodeSelect,
        },
      });

      edges.push({
        id: "edge-query-primary",
        source: "node-query",
        target: "group-primary",
        type: "bezier",
        style: { stroke: "#c2c2c2ff", strokeWidth: 1 },
      });

      const relationTypes = Object.keys(groupedStandards).filter(
        (k) => k !== "primary"
      );

      const totalRowWidth =
        relationTypes.length * CHILD_NODE_WIDTH +
        (relationTypes.length - 1) * CHILD_NODE_GAP;
      const startX = centerX - totalRowWidth / 2;

      relationTypes.forEach((rel, index) => {
        const groupId = `group-${rel}`;

        nodes.push({
          id: groupId,
          type: "groupNode",
          position: {
            x: startX + index * (CHILD_NODE_WIDTH + CHILD_NODE_GAP),
            y: primaryNodeY + CHILD_NODE_Y_OFFSET,
          },
          data: {
            type: rel,
            title: `${rel.charAt(0).toUpperCase() + rel.slice(1)} References`,
            standards: groupedStandards[rel],
            id: groupId,
            onSelect: onNodeSelect,
          },
        });

        edges.push({
          id: `edge-primary-${groupId}`,
          source: "group-primary",
          target: groupId,
          type: "bezier",
          style: { stroke: "#c2c2c2ff", strokeWidth: 1 },
        });
      });
    }

    return { nodes, edges };
  }, [
    appState,
    input,
    queryNodeY,
    queryNodeHeight,
    sidebarOpen,
    groupedStandards,
    onNodeSelect,
    stableOnSearch,
    stableOnHeightChange,
  ]);
};
