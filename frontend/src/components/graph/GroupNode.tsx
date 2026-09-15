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

interface CardProps {
  std: Standard;
  bottomBorder: boolean;
  rightBorder?: boolean;
}

const StandardCard = ({ std, bottomBorder, rightBorder = false }: CardProps) => (
  <div
    className={[
      "p-4 flex-1 min-w-0",
      bottomBorder ? "border-b border-zinc-100" : "",
      rightBorder ? "border-r border-zinc-200" : "",
    ]
      .filter(Boolean)
      .join(" ")}
  >
    <div className="flex justify-between items-start mb-1 gap-2">
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

    <div className="flex flex-wrap gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded">
        {std.status}
      </span>
      {std.relevance != null && (
        <span
          className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded ${getRelevanceColor(
            std.relevance
          )}`}
        >
          {std.relevance}% Relevance
        </span>
      )}
    </div>
  </div>
);

const TwoColGrid = ({ standards }: { standards: Standard[] }) => {
  const rows: Standard[][] = [];
  for (let i = 0; i < standards.length; i += 2) {
    rows.push(standards.slice(i, i + 2));
  }

  return (
    <>
      {rows.map((row, rowIdx) => {
        const isLastRow = rowIdx === rows.length - 1;
        return (
          <div key={rowIdx} className={`flex${isLastRow ? "" : " border-b border-zinc-200"}`}>
            {row.map((std, colIdx) => (
              <StandardCard
                key={std.id}
                std={std}
                bottomBorder={false}
                rightBorder={colIdx === 0 && row.length === 2}
              />
            ))}
            {/* 
            {row.length === 1 && <div className="" />} */}
          </div>
        );
      })}
    </>
  );
};


const SingleColList = ({ standards }: { standards: Standard[] }) => (
  <>
    {standards.map((std, idx) => (
      <StandardCard
        key={std.id}
        std={std}
        bottomBorder={idx < standards.length - 1}
      />
    ))}
  </>
);


export const GroupNode = ({ data }: { data: GroupNodeData }) => {
  const isPrimary = data.type === "primary";
  const count = data.standards.length;

  const useTwoCol = isPrimary ? count >= 2 : count > 3;
  const nodeWidth = useTwoCol ? 600 : 300;

  const headerLabel = isPrimary
    ? count === 1
      ? "Primary Standard"
      : "Primary Standards"
    : data.title;

  return (
    <div
      className="relative bg-white rounded-md border border-zinc-200 cursor-pointer
        animate-fade-in hover:border-zinc-400 hover:shadow-sm transition-all"
      style={{ width: nodeWidth }}
      onClick={() => data.onSelect(data.id)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!opacity-0 !w-0 !h-0 !border-0"
      />

      <div
        className={`px-4 h-10 border-b rounded-t-md flex justify-between items-center ${
          isPrimary
            ? "bg-zinc-900 border-zinc-900"
            : "bg-zinc-50 border-zinc-200"
        }`}
      >
        <div
          className={`text-[13px] font-medium uppercase tracking-wider flex items-center gap-2 ${
            isPrimary ? "text-white" : "text-zinc-500"
          }`}
        >
          <i
            className={`ph-fill text-xl ${
              isPrimary ? "ph-certificate" : "ph-file-text"
            }`}
          />
          {headerLabel}
        </div>
        <div
          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
            isPrimary ? "text-zinc-900 bg-white" : "text-zinc-500 bg-zinc-200"
          }`}
        >
          {count}
        </div>
      </div>

      <div className="overflow-hidden rounded-b-md">
        {count === 0 ? (
          <div className="p-4 text-[12px] text-zinc-400">No standards</div>
        ) : useTwoCol ? (
          <TwoColGrid standards={data.standards} />
        ) : (
          <SingleColList standards={data.standards} />
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!opacity-0 !w-0 !h-0 !border-0"
      />
    </div>
  );
};
