import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  type ChangeEvent,
  type KeyboardEvent,
  type DragEvent,
} from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";

interface QueryNodeData {
  query: string;
  attachedFile: File | null;
  isIdle: boolean;
  isLoading: boolean;
  isMovable: boolean;
  onSearch: (query: string, file?: File | null) => void;
  onFileChange: (file: File | null) => void;
  onHeightChange: (height: number) => void;
}

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "text/plain",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const ACCEPTED_EXTENSIONS = ".pdf,.png,.jpg,.jpeg,.webp,.gif,.txt,.csv,.docx,.xlsx";

function fileIcon(mime: string): string {
  if (mime.startsWith("image/")) return "ph-image";
  if (mime === "application/pdf") return "ph-file-pdf";
  if (mime.includes("word") || mime === "text/plain") return "ph-file-text";
  if (mime.includes("sheet") || mime === "text/csv") return "ph-table";
  return "ph-paperclip";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const QueryNode = ({ data }: { data: QueryNodeData }) => {
  const [localQuery, setLocalQuery] = useState(data.query);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    setLocalQuery(data.query);
  }, [data.query]);

  const onHeightChangeRef = useRef(data.onHeightChange);
  onHeightChangeRef.current = data.onHeightChange;

  const onFileChangeRef = useRef(data.onFileChange);
  onFileChangeRef.current = data.onFileChange;

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
    if (data.isLoading) return;
    const q = localQuery.trim() || (data.attachedFile ? `Specification Document: ${data.attachedFile.name}` : "");
    if (!q) return;
    data.onSearch(q, data.attachedFile);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const acceptFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) return;
      onFileChangeRef.current(file);
    },
    []
  );

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
    
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!data.isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (data.isLoading) return;
    const file = e.dataTransfer.files[0];
    if (file) acceptFile(file);
  };

  const removeFile = () => {
    onFileChangeRef.current(null);
  };

  return (
    <div
      ref={containerRef}
      className={`${data.isMovable ? "" : "nodrag"} relative flex flex-col items-center`}
    >
      {data.isIdle && (
        <div className="mb-8 text-center pointer-events-none animate-fade-in select-none">
          <img src="/favicon.svg" alt="Sahayak Logo" className="w-14 h-14 object-contain mx-auto mb-4" />
          <h1 className="text-[28px] font-bold tracking-tight leading-relaxed text-zinc-900 mb-1">
            Sahayak
          </h1>
          <p className="text-[14px] font-medium text-zinc-400 uppercase tracking-widest">
            ~ Indian Standards Engine ~
          </p>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => textareaRef.current?.focus()}
        className={`${data.isMovable ? "cursor-grab active:cursor-grabbing" : "nodrag"} bg-white border rounded-md w-[440px] relative transition-all shadow-sm ${
          isDragging
            ? "border-zinc-500 ring-2 ring-zinc-200 scale-[1.01]"
            : data.isLoading
            ? "border-zinc-400 cursor-not-allowed"
            : "border-zinc-300 hover:border-zinc-400 focus-within:border-zinc-500"
        } ${data.isIdle ? "animate-fade-in" : ""}`}
      >
        <textarea
          ref={textareaRef}
          value={localQuery}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          disabled={data.isLoading}
          rows={1}
          className="nodrag w-full bg-transparent px-5 pt-4 pb-2 text-[15px] font-medium text-zinc-800 placeholder:text-zinc-400 focus:outline-none resize-none leading-relaxed min-h-[80px] block disabled:opacity-70 cursor-text select-text relative z-10"
          placeholder="Describe your product specifications (e.g. 500 kVA distribution transformer, LED street lighting)..."
        />

        {/* Bordered upload file dropzone / display */}
        <div className="mx-4 mb-3">
          {data.attachedFile && !data.isLoading ? (
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 animate-fade-in">
              <i className={`ph-fill ${fileIcon(data.attachedFile.type)} text-xl text-zinc-500 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-medium text-zinc-800 truncate block">
                  {data.attachedFile.name}
                </span>
                <span className="text-[11px] text-zinc-400 block">
                  {formatBytes(data.attachedFile.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="nodrag flex-shrink-0 text-zinc-400 hover:text-red-600 transition-colors focus:outline-none p-1 cursor-pointer"
                title="Remove file"
              >
                <i className="ph ph-trash text-lg" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              disabled={data.isLoading}
              className="nodrag w-full border border-dashed border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50/60 rounded-md py-2 px-3 flex items-center justify-between text-left transition-all cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center gap-2 text-zinc-500 group-hover:text-zinc-700">
                <i className="ph ph-paperclip text-base" />
                <span className="text-[12px] font-medium">Attach Tender Specification (PDF / DOCX)</span>
              </div>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                Browse
              </span>
            </button>
          )}
        </div>

        {data.isLoading && (
          <div className="px-5 pb-3 flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-[12px] font-medium text-zinc-400 uppercase tracking-wider truncate">
              {data.attachedFile
                ? `Analysing with ${data.attachedFile.name}…`
                : "Analysing standards…"}
            </span>
          </div>
        )}

        <div className="flex items-center justify-end px-4 pb-3 pt-1 border-t border-zinc-100">
          <button
            type="button"
            onClick={handleSubmit}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            disabled={data.isLoading || (!localQuery.trim() && !data.attachedFile)}
            className="nodrag h-8 px-4 bg-zinc-900 text-white rounded-md text-[13px] font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            <span>{data.isLoading ? "Analysing..." : "Submit"}</span>
            <i
              className={`ph ${
                data.isLoading ? "ph-spinner animate-spin" : "ph-arrow-right"
              } text-sm`}
            />
          </button>
        </div>

        {isDragging && (
          <div className="absolute inset-0 rounded-md bg-zinc-50/80 flex flex-col items-center justify-center pointer-events-none animate-fade-in">
            <i className="ph ph-upload-simple text-3xl text-zinc-500 mb-1" />
            <span className="text-[15px] font-bold leading-relaxed text-zinc-500 uppercase tracking-widest">
              Drop to attach
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

        <Handle
          type="source"
          position={Position.Bottom}
          className="!opacity-0 !w-0 !h-0 !border-0"
        />
      </div>
    </div>
  );
};
