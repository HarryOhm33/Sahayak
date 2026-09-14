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
    if (data.isLoading || !localQuery.trim()) return;
    data.onSearch(localQuery, data.attachedFile);
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
    <div ref={containerRef} className="relative flex flex-col items-center">
      {data.isIdle && (
        <div className="mb-8 text-center pointer-events-none animate-fade-in">
          <i className="ph-fill ph-solar-panel text-[56px] text-zinc-900 mb-4" />
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
        className={`bg-white border rounded-md w-[440px] relative transition-all shadow-sm ${
          isDragging
            ? "border-zinc-500 ring-2 ring-zinc-200 scale-[1.01]"
            : data.isLoading
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
          className="w-full bg-transparent px-5 pt-4 pb-3 text-[15px] font-medium text-zinc-600 focus:outline-none resize-none leading-relaxed min-h-[100px] block disabled:opacity-70"
          placeholder={
            isDragging
              ? "Drop file here…"
              : "What product are you trying to get certified? ..."
          }
        />

      
        {data.attachedFile && !data.isLoading && (
          <div className="mx-3 mb-3 flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded px-2 py-0.5 animate-fade-in">
            <i className={`ph-fill ${fileIcon(data.attachedFile.type)} text-xl text-zinc-500 flex-shrink-0`} />
            <span className="text-[13px] font-medium text-zinc-700 truncate flex-1 min-w-0">
              {data.attachedFile.name}
            </span>
            <span className="text-[11px] text-zinc-400 flex-shrink-0">
              {formatBytes(data.attachedFile.size)}
            </span>
            <button
              onClick={removeFile}
              className="flex-shrink-0 text-zinc-400 hover:text-red-600 transition-colors focus:outline-none ml-1"
              title="Remove file"
            >
              <i className="ph ph-trash text-lg" />
            </button>
          </div>
        )}

    
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

        <div className="flex items-center justify-between px-3 pb-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={data.isLoading}
            title="Attach a file (PDF, image, doc…)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[12px] font-medium uppercase tracking-wider transition-colors focus:outline-none ${
              data.attachedFile
                ? "text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
                : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <i className={`ph ${data.attachedFile ? "ph-swap" : "ph-line-segments"} text-[15px]`} />
            {data.attachedFile ? "Replace File" : "Upload File"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={data.isLoading}
            className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <i
              className={`ph ${
                data.isLoading ? "ph-spinner animate-spin" : "ph-arrow-right"
              } text-base`}
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
