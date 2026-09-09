import { useState, useCallback } from "react";
import ReactFlow, { Background, BackgroundVariant } from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";

import { nodeTypes } from "./components/graph/nodeTypes";
import { StandardsSidebar } from "./components/sidebar/StandardsSidebar";
import { useGraphLayout } from "./hooks/useGraphLayout";
import { useRecommend } from "./hooks/useRecommend";
import { QUERY_NODE_DEFAULT_HEIGHT } from "./constants/layout";

type AppState = "idle" | "loading" | "results" | "error";

export default function App() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [input, setInput] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [queryNodeHeight, setQueryNodeHeight] = useState(QUERY_NODE_DEFAULT_HEIGHT);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { status, result, error, recommend, reset } = useRecommend();

  const queryNodeY = appState === "idle" ? window.innerHeight / 2 - 160 : 40;

  const handleSearch = useCallback(
    async (query?: string) => {
      const q = (query ?? input).trim();
      if (!q) return;
      if (query) setInput(query);

      setAppState("loading");
      setSidebarOpen(false);
      setSelectedGroupId(null);

      await recommend(q);
    },
    [input, recommend]
  );

  if (status === "success" && appState === "loading") {
    setAppState("results");
    setSelectedGroupId("group-primary");
    setSidebarOpen(true);
  }
  if (status === "error" && appState === "loading") {
    setAppState("error");
  }

  const onNodeSelect = useCallback((id: string) => {
    setSelectedGroupId(id);
    setSidebarOpen(true);
  }, []);

  const handleReset = useCallback(() => {
    reset();
    setAppState("idle");
    setInput("");
    setSelectedGroupId(null);
    setSidebarOpen(false);
  }, [reset]);

  const groupedStandards = result?.grouped ?? {};

  const selectedGroup = selectedGroupId
    ? selectedGroupId.replace("group-", "")
    : null;
  const standardsInSelectedGroup = selectedGroup
    ? (groupedStandards[selectedGroup] ?? [])
    : [];

  const { nodes, edges } = useGraphLayout({
    appState,
    input,
    queryNodeY,
    queryNodeHeight,
    sidebarOpen,
    groupedStandards,
    onSearch: handleSearch,
    onHeightChange: setQueryNodeHeight,
    onNodeSelect,
  });

  return (
    <div className="w-full h-screen bg-white text-zinc-900 overflow-hidden font-sans relative">
      <div className="absolute inset-0 flex w-full h-full bg-zinc-50">

        <div className="relative flex-1 h-full">

          {appState !== "idle" && (
            <div className="absolute top-5 left-5 z-10 animate-fade-in flex items-center gap-2">
              <div className="bg-white border border-zinc-200 px-3 py-1.5 rounded-md flex items-center gap-2 shadow-sm">
                <i className="ph-fill ph-target text-base text-zinc-900" />
                <span className="text-[11px] font-medium text-zinc-900 uppercase tracking-widest">
                  IS Intelligence
                </span>
              </div>
            </div>
          )}

          {appState === "error" && error && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 animate-fade-in max-w-[500px] w-full px-4">
              <div className="bg-white border border-zinc-200 rounded-md p-4 flex items-start gap-3 shadow-sm">
                <i className="ph ph-warning-circle text-xl text-zinc-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-[12px] font-medium text-zinc-800 uppercase tracking-wider mb-1">
                    Request Failed
                  </div>
                  <p className="text-[13px] font-medium text-zinc-600 leading-relaxed">
                    {error}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1 uppercase tracking-wider">
                    Make sure the backend is running on port 3001
                  </p>
                </div>
              </div>
            </div>
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            minZoom={0.2}
            maxZoom={1.5}
            zoomOnScroll={false}
            panOnScroll={true}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              gap={24}
              size={1}
              variant={BackgroundVariant.Dots}
              color="#d4d4d8"
            />
          </ReactFlow>
        </div>

        <StandardsSidebar
          isOpen={sidebarOpen}
          isVisible={appState !== "idle" && appState !== "loading"}
          standards={standardsInSelectedGroup}
          onToggle={() => setSidebarOpen((o) => !o)}
        />

      </div>
    </div>
  );
}
