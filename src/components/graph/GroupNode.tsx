import { Handle, Position } from "reactflow";
import { getRelevanceColor } from "../../utils/relevance";
import type { Standard } from "../../types/standards";

interface GroupNodeData {
  id: string;
  type: string;
  title: string;
  standards: Standard[];
  onSelect: (id: string) => void;
}

export const GroupNode = ({ data }: { data: GroupNodeData }) => {
  const isPrimary = data.type === "primary";

  return (
    <div
      className={`relative bg-white rounded-md transition-all cursor-pointer group animate-fade-in ${isPrimary
        ? "border border-zinc-300 w-[320px] p-0"
        : "border border-zinc-300 w-[320px] p-0 hover:border-gray-400/70"
        }`}
      onClick={() => {
        data.onSelect(data.id);
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!opacity-0 !w-0 !h-0 !border-0"
      />

      <div
        className={`px-4 py-3 border-b rounded-t-md flex justify-between items-center ${isPrimary
          ? "bg-zinc-900 border-zinc-900"
          : "bg-zinc-50 border-zinc-200"
          }`}
      >
        <div
          className={`text-[13px] font-medium uppercase tracking-wider flex items-center gap-2 ${isPrimary ? "text-white" : "text-zinc-500"
            }`}
        >
          <i className={`ph-fill ${isPrimary ? "ph-star" : "ph-layers"}`} />
          {data.title}
        </div>
        <div
          className={`text-[12px] font-medium px-2 rounded-md ${isPrimary
            ? "text-zinc-900 bg-white"
            : "text-zinc-500 bg-zinc-200"
            }`}
        >
          {data.standards.length}
        </div>
      </div>

      <div className="p-0">
        {data.standards.map((std, idx) => (
          <div
            key={std.id}
            className={`p-4 ${idx !== data.standards.length - 1
              ? "border-b border-zinc-100"
              : ""
              }`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="text-[16px] font-medium text-zinc-900 tracking-tight">
                {std.number}
              </div>
              <div className="text-[11px] font-medium text-zinc-400">
                {std.edition}
              </div>
            </div>
            <div className="text-[13px] font-medium text-zinc-600 leading-relaxed tracking-wide line-clamp-2 mb-3">
              {std.title}
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              <span className="text-[9px] font-medium uppercase tracking-wider px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md">
                {std.status}
              </span>
              {std.relevance && (
                <span
                  className={`text-[9px] font-medium uppercase tracking-wider px-2 py-1 rounded-md ${getRelevanceColor(
                    std.relevance
                  )}`}
                >
                  {std.relevance}% RELEVANT
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!opacity-0 !w-0 !h-0 !border-0"
      />
    </div>
  );
};
