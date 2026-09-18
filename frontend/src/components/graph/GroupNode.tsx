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

const StandardCard = ({ std, bottomBorder, rightBorder = false }: CardProps) => {
  const bisUrl =
    std.url ||
    `https://www.services.bis.gov.in/php/BIS_2.0/bis_review/standard_review/StandardDetails?val=${encodeURIComponent(
      std.number
    )}`;

  return (
    <div
      className={[
        "p-3.5 sm:p-4 flex-1 min-w-0 bg-white flex flex-col justify-between",
        bottomBorder ? "border-b border-slate-200" : "",
        rightBorder ? "border-r border-slate-200" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-extrabold text-slate-900 tracking-tight">
              {std.number}
            </span>
          </div>
          <div className="text-[11px] font-semibold text-slate-400 flex-shrink-0">
            {std.edition}
          </div>
        </div>

        <div className="text-xs font-medium text-slate-600 leading-relaxed line-clamp-2 mb-3">
          {std.title}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 mt-1">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded">
          Current Version
        </span>
        {std.relevance != null && (
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${getRelevanceColor(
              std.relevance
            )}`}
          >
            {std.relevance}% Relevance
          </span>
        )}
      </div>
    </div>
  );
};

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
          <div key={rowIdx} className={`flex${isLastRow ? "" : " border-b border-slate-200"}`}>
            {row.map((std, colIdx) => (
              <StandardCard
                key={std.id}
                std={std}
                bottomBorder={false}
                rightBorder={colIdx === 0 && row.length === 2}
              />
            ))}
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

function getHeaderStyle(type: string, title: string) {
  if (type === "primary") {
    return { bg: "bg-blue-700 border-blue-700 text-white", badge: "bg-blue-900/60 text-white", icon: "ph-star-fill text-amber-300" };
  }
  const lower = title.toLowerCase();
  if (lower.includes("testing")) {
    return { bg: "bg-emerald-700 border-emerald-700 text-white", badge: "bg-emerald-900/60 text-white", icon: "ph-flask-fill text-emerald-200" };
  }
  if (lower.includes("safety")) {
    return { bg: "bg-amber-600 border-amber-600 text-white", badge: "bg-amber-900/60 text-white", icon: "ph-shield-check-fill text-amber-100" };
  }
  if (lower.includes("installation")) {
    return { bg: "bg-purple-700 border-purple-700 text-white", badge: "bg-purple-900/60 text-white", icon: "ph-wrench-fill text-purple-200" };
  }
  return { bg: "bg-slate-700 border-slate-700 text-white", badge: "bg-slate-900/60 text-white", icon: "ph-file-text-fill text-slate-300" };
}

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

  const headerStyle = getHeaderStyle(data.type, data.title);

  return (
    <div
      className="relative bg-white rounded-xl border border-slate-200 cursor-pointer overflow-hidden transition-all hover:bg-slate-50"
      style={{ width: nodeWidth }}
      onClick={(e) => {
        e.stopPropagation();
        data.onSelect(data.id);
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!opacity-0 !w-0 !h-0 !border-0"
      />

      <div
        className={`px-4 h-11 border-b flex justify-between items-center ${headerStyle.bg}`}
      >
        <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <i className={`ph ${headerStyle.icon} text-base`} />
          <span>{headerLabel}</span>
        </div>
        <div className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${headerStyle.badge}`}>
          {count}
        </div>
      </div>

      <div className="overflow-hidden bg-white">
        {count === 0 ? (
          <div className="p-4 text-xs font-medium text-slate-400">No standards</div>
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
