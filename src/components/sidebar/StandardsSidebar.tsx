import { CollapsibleStandard } from "./CollapsibleStandard";
import type { Standard } from "../../types/standards";

interface StandardsSidebarProps {
  isOpen: boolean;
  isVisible: boolean;
  standards: Standard[];
  onToggle: () => void;
}

export const StandardsSidebar = ({
  isOpen,
  isVisible,
  standards,
  onToggle,
}: StandardsSidebarProps) => {
  if (!isVisible) return null;

  return (
    <div className="relative flex-shrink-0 h-full">
      <button
        onClick={onToggle}
        className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-5 h-16 bg-white border-y border-l border-zinc-200 rounded-l-md flex items-center justify-center hover:bg-zinc-50 transition-colors focus:outline-none shadow-sm"
      >
        <i
          className={`ph ${
            isOpen ? "ph-caret-right" : "ph-caret-left"
          } text-zinc-400 text-[15px]`}
        />
      </button>

      <div
        className={`h-full bg-white border-l border-zinc-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "w-[420px]" : "w-0"
        }`}
      >
        <div className="w-[420px] h-full overflow-y-auto custom-scrollbar relative flex-shrink-0">
          {standards.length > 0 ? (
            standards.map((std, index) => (
              <CollapsibleStandard
                key={std.id}
                std={std}
                isLast={index === standards.length - 1}
              />
            ))
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
              <i className="ph ph-hand-pointing text-4xl mb-3" />
              <p className="text-[12px] font-medium uppercase tracking-wider">
                Select a standard group from the graph
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
