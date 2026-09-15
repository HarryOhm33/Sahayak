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
    <>
      {/* Mobile Backdrop Overlay when open (constrained inside main view) */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="absolute inset-0 bg-black/20 backdrop-blur-2xs z-30 sm:hidden transition-opacity"
        />
      )}

      {/* Floating Overlay Container below Navbar */}
      <div
        className={`absolute right-0 top-0 bottom-0 h-full z-40 select-none ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Toggle Edge Button Tab */}
        <button
          type="button"
          onClick={onToggle}
          className="absolute -left-6 sm:-left-5 top-1/2 -translate-y-1/2 z-50 w-6 h-14 sm:w-5 sm:h-16 bg-white border-y border-l border-zinc-200 rounded-l-xl flex items-center justify-center hover:bg-zinc-50 transition-colors focus:outline-none shadow-md cursor-pointer pointer-events-auto"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <i
            className={`ph ${
              isOpen ? "ph-caret-right" : "ph-caret-left"
            } text-zinc-600 text-base sm:text-xs`}
          />
        </button>

        {/* Sidebar Container Panel */}
        <div
          className={`h-full bg-white border-l border-zinc-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out shadow-2xl ${
            isOpen
              ? "w-[85vw] max-w-[420px] sm:w-[380px] md:w-[420px] opacity-100"
              : "w-0 opacity-0"
          }`}
        >
          <div className="w-[85vw] max-w-[420px] sm:w-[380px] md:w-[420px] h-full flex flex-col overflow-hidden relative flex-shrink-0">
            {/* Top Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-200 bg-white sticky top-0 z-10 flex-shrink-0 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-700 text-amber-300 flex items-center justify-center text-sm shadow-2xs">
                  <i className="ph-fill ph-books" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Standards Details
                  </h3>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                    {standards.length}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggle}
                className="p-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                title="Collapse Sidebar"
              >
                <span>Collapse</span>
                <i className="ph ph-caret-right text-xs" />
              </button>
            </div>

            {/* Scrollable Content List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-white">
              {standards.length > 0 ? (
                standards.map((std, index) => (
                  <CollapsibleStandard
                    key={std.id}
                    std={std}
                    isLast={index === standards.length - 1}
                  />
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 p-8 text-center min-h-[300px]">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-3">
                    <i className="ph ph-hand-pointing text-2xl" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 max-w-[220px] leading-relaxed">
                    Select a standard group from the graph to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
