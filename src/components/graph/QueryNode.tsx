import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";

interface QueryNodeData {
  query: string;
  isIdle: boolean;
  isLoading: boolean;
  onSearch: (query: string) => void;
  onHeightChange: (height: number) => void;
}

export const QueryNode = ({ data }: { data: QueryNodeData }) => {
  const [localQuery, setLocalQuery] = useState(data.query);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const updateNodeInternals = useUpdateNodeInternals();

  const onHeightChangeRef = useRef(data.onHeightChange);
  onHeightChangeRef.current = data.onHeightChange;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      onHeightChangeRef.current?.(el.offsetHeight);
      updateNodeInternals("node-query");
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateNodeInternals]);

  useLayoutEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
    setLocalQuery(ta.value);
  };

  const handleSubmit = () => {
    if (data.isLoading || !localQuery.trim()) return;
    data.onSearch(localQuery);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center">
      {data.isIdle && (
        <div className="mb-8 text-center pointer-events-none animate-fade-in">
          <i className="ph-fill ph-target text-[56px] text-zinc-900 mb-4" />
          <h1 className="text-[28px] font-medium tracking-tight text-zinc-900 mb-1">
            IS Intelligence
          </h1>
          <p className="text-[12px] font-medium text-zinc-400 uppercase tracking-widest">
            Indian Standards Engine
          </p>
        </div>
      )}

      <div
        className={`bg-white border rounded-md w-[440px] relative transition-colors shadow-sm ${
          data.isLoading
            ? "border-zinc-400 cursor-not-allowed"
            : "border-zinc-300 hover:border-zinc-400"
        } ${data.isIdle ? "animate-fade-in" : ""}`}
      >
        <textarea
          ref={textareaRef}
          value={localQuery}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={data.isLoading}
          rows={1}
          className="w-full bg-transparent px-5 pt-4 pb-5 text-[15px] font-medium text-zinc-600 focus:outline-none resize-none leading-relaxed min-h-[100px] block disabled:opacity-70"
          placeholder="What product are you trying to get certified? ..."
        />

        {data.isLoading && (
          <div className="px-5 pb-3 flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              Analysing standards…
            </span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={data.isLoading}
          className="absolute bottom-2 right-2 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i
            className={`ph ${
              data.isLoading ? "ph-spinner animate-spin" : "ph-arrow-right"
            } text-base`}
          />
        </button>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!opacity-0 !w-0 !h-0 !border-0"
        />
      </div>
    </div>
  );
};
