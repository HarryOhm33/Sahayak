import { useState, useCallback, useEffect, useRef, type ChangeEvent, type DragEvent } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import ReactFlow, { Background, BackgroundVariant, Controls, PanOnScrollMode } from "reactflow";
import "reactflow/dist/style.css";
import "../App.css";

import { nodeTypes } from "../components/graph/nodeTypes";
import { StandardsSidebar } from "../components/sidebar/StandardsSidebar";
import { Sidebar as LeftRecommendSidebar } from "../components/Sidebar";
import { ExportButton } from "../components/export/ExportButton";
import { useGraphLayout } from "../hooks/useGraphLayout";
import { useRecommend } from "../hooks/useRecommend";
import { QUERY_NODE_DEFAULT_HEIGHT } from "../constants/layout";

type AppState = "idle" | "loading" | "results" | "error";

const EXAMPLE_QUERIES = [
  {
    label: "500 kVA Distribution Transformer",
    query: "500 kVA, 11kV/433V outdoor distribution transformer for municipal substation use",
  },
  {
    label: "LED Street Lighting",
    query: "LED Street Lighting luminaires with surge protection for urban roads and highways",
  },
  {
    label: "Solar PV Modules",
    query: "Crystalline Silicon Terrestrial Photovoltaic (PV) Modules for utility solar projects",
  },
  {
    label: "Reinforced Concrete Pipes",
    query: "Precast reinforced concrete pipes for drainage culverts and sewerage works",
  },
];

const ACCEPTED_EXTENSIONS = ".pdf,.png,.jpg,.jpeg,.webp,.gif,.txt,.csv,.docx,.xlsx";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(mime: string): string {
  if (mime.startsWith("image/")) return "ph-image";
  if (mime === "application/pdf") return "ph-file-pdf";
  if (mime.includes("word") || mime === "text/plain") return "ph-file-text";
  if (mime.includes("sheet") || mime === "text/csv") return "ph-table";
  return "ph-paperclip";
}

export const RecommendPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [appState, setAppState] = useState<AppState>("idle");
  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [queryNodeHeight, setQueryNodeHeight] = useState(QUERY_NODE_DEFAULT_HEIGHT);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { status, result, error, recommend, reset } = useRecommend();

  // Chatbox position inside ReactFlow when results arrive
  const queryNodeY = 40;

  const handleSearch = useCallback(
    async (query?: string, file?: File | null) => {
      const targetFile = file !== undefined ? file : attachedFile;
      const q = (query ?? input).trim() || (targetFile ? `Specification Document: ${targetFile.name}` : "");
      if (!q) return;
      if (query) setInput(query);

      setAppState("loading");
      setSidebarOpen(false);
      setSelectedGroupId(null);

      await recommend(q, targetFile);
    },
    [input, recommend, attachedFile]
  );

  // Auto-search if query param 'q' is passed (e.g. from Home page)
  const initialSearchDone = useRef(false);
  useEffect(() => {
    const qParam = searchParams.get("q");
    if (qParam && !initialSearchDone.current) {
      initialSearchDone.current = true;
      setInput(qParam);
      handleSearch(qParam);
    }
  }, [searchParams, handleSearch]);

  if (status === "success" && appState === "loading") {
    setAppState("results");
    setSelectedGroupId("group-primary");
    setSidebarOpen(typeof window !== "undefined" ? window.innerWidth >= 640 : true);
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
    setAttachedFile(null);
    setSelectedGroupId(null);
    setSidebarOpen(false);
  }, [reset]);

  // Listen to navigation state resets (e.g., from Navbar New Query action)
  useEffect(() => {
    if (location.state && (location.state as any).reset) {
      handleReset();
    }
  }, [location.state, handleReset]);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (appState !== "loading") setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (appState === "loading") return;
    const file = e.dataTransfer.files[0];
    if (file) setAttachedFile(file);
  };

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
    attachedFile,
    onSearch: handleSearch,
    onFileChange: setAttachedFile,
    onHeightChange: setQueryNodeHeight,
    onNodeSelect,
  });

  // =========================================================================
  // VIEW 1: NORMAL DOM SCREEN (When idle or loading or error without results)
  // =========================================================================
  if (appState !== "results") {
    return (
      <div className="w-full h-full max-w-full overflow-hidden flex-1 bg-slate-50 text-slate-900 font-sans relative flex flex-col min-h-0 selection:bg-blue-100">
        <LeftRecommendSidebar />
        <div className="w-full h-full flex-1 overflow-y-auto flex flex-col items-center justify-center min-h-0">
          <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-6 py-6 sm:py-8 max-w-2xl mx-auto w-full text-center">
            {/* Logo & Header */}
            <div className="mb-6 flex flex-col items-center animate-fade-in">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center shadow-md mb-3 p-2">
                <img src="/favicon.svg" alt="Sahayak Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Sahayak
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md border border-slate-200">
                  AI Engine
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Bureau of Indian Standards Copilot
              </p>
            </div>

            {/* Error Banner if request failed */}
            {appState === "error" && error && (
              <div className="w-full mb-4 animate-fade-in text-left">
                <div className="bg-white border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
                  <i className="ph ph-warning-circle text-xl text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-0.5">
                      Request Failed
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {error}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">
                      Make sure the backend is running on port 3001
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Normal HTML Card Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`bg-white border rounded-2xl w-full text-left transition-all shadow-sm ${isDragging
                ? "border-blue-500 ring-2 ring-blue-100 scale-[1.005]"
                : appState === "loading"
                  ? "border-slate-300 shadow-md"
                  : "border-slate-200/90 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50"
                }`}
            >
              {/* Standard Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                disabled={appState === "loading"}
                rows={3}
                autoFocus
                className="w-full bg-transparent px-4 sm:px-5 pt-4 pb-2 text-sm sm:text-[15px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed min-h-[105px] block disabled:opacity-70 cursor-text overflow-hidden"
                placeholder="What product are you trying to get certified? (e.g. Outdoor LED street lights, 100W, 230V AC, IP66)..."
              />

              {/* Bordered File Upload Dropzone */}
              <div className="px-4 sm:px-5 pb-3">
                {attachedFile && appState !== "loading" ? (
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5 animate-fade-in">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-blue-700 shadow-2xs">
                      <i className={`ph-fill ${fileIcon(attachedFile.type)} text-lg`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-[13px] font-semibold text-slate-800 truncate block">
                        {attachedFile.name}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {formatBytes(attachedFile.size)} &bull; Document attached
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Remove file"
                    >
                      <i className="ph ph-trash text-base" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/40 rounded-xl py-2.5 px-3.5 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 text-slate-500 group-hover:text-blue-700 min-w-0">
                      <i className="ph ph-paperclip text-lg text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-700 truncate block">
                          Attach Tender Specification Document
                        </span>
                        <span className="text-[11px] text-slate-400 truncate block">
                          PDF, DOCX, XLSX, TXT, images
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md transition-colors flex-shrink-0">
                      Upload
                    </span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_EXTENSIONS}
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Loading Indicator */}
              {appState === "loading" && (
                <div className="px-4 sm:px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2 animate-fade-in rounded-b-2xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex gap-1 flex-shrink-0">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                    <span className="text-xs font-medium text-slate-600 truncate">
                      {attachedFile
                        ? `Analysing specification with ${attachedFile.name}…`
                        : "Querying Indian Standards & normative references…"}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider flex-shrink-0">
                    Processing
                  </span>
                </div>
              )}

              {/* Bottom Actions Row */}
              {appState !== "loading" && (
                <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    Press <kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded text-slate-600 text-[10px]">Enter</kbd> to search
                  </span>

                  <button
                    type="button"
                    onClick={() => handleSearch()}
                    disabled={!input.trim() && !attachedFile}
                    className="w-full sm:w-auto justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-blue-600/20 ml-auto"
                  >
                    <span>Analyze Standards</span>
                    <i className="ph ph-arrow-right text-sm" />
                  </button>
                </div>
              )}
            </div>

            {/* Quick Example Query Pills */}
            <div className="mt-8 flex flex-col items-center gap-2.5 w-full animate-fade-in">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Sample Queries
              </span>
              <div className="flex flex-wrap justify-center gap-2 max-w-xl">
                {EXAMPLE_QUERIES.map((eq) => (
                  <button
                    key={eq.label}
                    type="button"
                    onClick={() => {
                      setInput(eq.query);
                      handleSearch(eq.query);
                    }}
                    className="bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-[12px] font-semibold text-slate-700 hover:text-blue-700 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs text-left"
                  >
                    {eq.label}
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: REACTFLOW GRAPH (Rendered ONLY when data from backend arrives!)
  // =========================================================================
  return (
    <div className="w-full h-full max-h-full flex-1 bg-slate-50 text-slate-900 overflow-hidden font-sans relative min-h-0">
      <LeftRecommendSidebar />
      <div className="relative flex-1 w-full h-full overflow-hidden touch-none select-none">
        <div className="absolute inset-0 flex w-full h-full bg-slate-50">
          <div className="relative flex-1 h-full touch-none">

            {/* Notification badge */}
            <div className="absolute top-4 right-6 z-10 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-xs select-none pointer-events-none">
              <i className="ph ph-tree-structure text-sm text-blue-600" />
              <span>Standards Relationship Map &bull; Drag nodes or pan canvas freely</span>
            </div>

            {/* Interactive ReactFlow Graph Canvas */}
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              minZoom={0.1}
              maxZoom={2.0}
              defaultViewport={typeof window !== "undefined" && window.innerWidth < 640 ? { x: -30, y: 20, zoom: 0.6 } : undefined}
              nodesDraggable={false}
              panOnDrag={true}
              panOnScroll={true}
              panOnScrollMode={PanOnScrollMode.Free}
              zoomOnScroll={true}
              zoomOnPinch={true}
              zoomOnDoubleClick={false}
              elementsSelectable={true}
              preventScrolling={true}
              proOptions={{ hideAttribution: true }}
              onNodeClick={(_event, node) => {
                if (node.type === "groupNode") {
                  onNodeSelect(node.id);
                }
              }}
            >
              <Background
                gap={24}
                size={1}
                variant={BackgroundVariant.Dots}
                color="#cbd5e1"
              />
              <Controls
                showInteractive={false}
                className="bg-white border border-slate-200 rounded-xl shadow-sm !left-3 sm:!left-6 !bottom-5 sm:!bottom-6 font-sans scale-90 sm:scale-100 origin-bottom-left"
              />
            </ReactFlow>

            {/* Export button — bottom-left floating panel */}
            {result && (
              <div className="absolute bottom-5 sm:bottom-6 left-[60px] sm:left-24 z-10 animate-fade-in">
                <ExportButton query={input} result={result} />
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          <StandardsSidebar
            isOpen={sidebarOpen}
            isVisible={true}
            standards={standardsInSelectedGroup}
            onToggle={() => setSidebarOpen((o) => !o)}
          />
        </div>
      </div>
    </div>
  );
};

