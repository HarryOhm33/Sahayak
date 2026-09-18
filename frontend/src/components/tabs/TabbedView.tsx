import { useState } from "react";
import type { Standard } from "../../types/standards";
import { getRelevanceColor } from "../../utils/relevance";

interface TabbedViewProps {
  groupedStandards: Record<string, Standard[]>;
  query?: string;
  attachedFile?: File | null;
}

const RELATION_ORDER = [
  "primary",
  "normative",
  "testing",
  "safety",
  "installation",
  "related",
];

const RELATION_LABELS: Record<string, string> = {
  primary: "Primary Standards",
  normative: "Normative References",
  testing: "Testing Standards",
  safety: "Safety Standards",
  installation: "Installation Codes",
  related: "Related Standards",
};

export const TabbedView = ({ groupedStandards, query, attachedFile }: TabbedViewProps) => {
  const availableTabs = RELATION_ORDER.filter(
    (key) => groupedStandards[key] && groupedStandards[key].length > 0
  );

  // default to the first available category (usually primary), not original query
  const [activeTab, setActiveTab] = useState(availableTabs[0] || "original_query");

  if (availableTabs.length === 0 && !query && !attachedFile) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        No standards found.
      </div>
    );
  }

  const standards = groupedStandards[activeTab] || [];

  return (
    <>
      <style>{`
        .mobile-tabs-container { display: flex; flex-direction: column; }
        .desktop-sidebar-container { display: none; }
        .tabbed-layout-wrapper { flex-direction: column; }
        @media (min-width: 768px) {
          .mobile-tabs-container { display: none !important; }
          .desktop-sidebar-container { display: flex !important; }
          .tabbed-layout-wrapper { flex-direction: row !important; }
        }
      `}</style>

      <div className="flex-1 flex h-full bg-slate-50 overflow-hidden relative tabbed-layout-wrapper">
        
        {/* MOBILE TOP BAR (Visible only on mobile via custom CSS) */}
        <div className="w-full bg-white border-b border-slate-200 mobile-tabs-container shrink-0 z-10">
          <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab("original_query")}
              className={`shrink-0 px-4 py-2 rounded-xl text-[12px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "original_query"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <i className={`ph ph-magnifying-glass ${activeTab === "original_query" ? "text-white" : "text-slate-400"}`} />
              <span>Original Query</span>
            </button>
            
            <div className="w-[1px] h-6 bg-slate-200 mx-1 shrink-0" />
            
            {availableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-4 py-2 rounded-xl text-[12px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === tab
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200"
                }`}
              >
                <span>{RELATION_LABELS[tab] || tab}</span>
                <span
                  className={`text-[9px] py-0.5 px-2 rounded-full font-bold ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {groupedStandards[tab].length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* DESKTOP SIDEBAR (Visible only on desktop via custom CSS) */}
        <div className="w-48 sm:w-64 md:w-72 bg-white border-r border-slate-200 flex-col py-6 shrink-0 overflow-y-auto z-10 desktop-sidebar-container">
          <h3 className="px-5 sm:px-6 text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Input Details</h3>
          <div className="flex flex-col gap-1 px-2 sm:px-3 mb-6">
            <button
              onClick={() => setActiveTab("original_query")}
              className={`text-left px-3 sm:px-4 py-2.5 rounded-xl text-[13.5px] sm:text-[13px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "original_query"
                  ? "bg-slate-900 text-white"
                  : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>Original Query</span>
              <i className={`ph ph-magnifying-glass ${activeTab === "original_query" ? "text-white" : "text-slate-400"}`} />
            </button>
          </div>

          <h3 className="px-5 sm:px-6 text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Categories</h3>
          <div className="flex flex-col gap-1 px-2 sm:px-3">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-3 sm:px-4 py-2.5 rounded-xl text-[13.5px] sm:text-[13px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === tab
                    ? "bg-blue-50 text-blue-700"
                    : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{RELATION_LABELS[tab] || tab}</span>
                <span
                  className={`text-[9px] sm:text-[10px] py-0.5 px-2 rounded-full font-bold shrink-0 ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {groupedStandards[tab].length}
                </span>
              </button>
            ))}
          </div>
        </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 w-full bg-slate-50/50">
        {activeTab === "original_query" ? (
          <div className="max-w-3xl mx-auto flex flex-col gap-6 animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <i className="ph-fill ph-magnifying-glass text-blue-600 text-xl" />
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Original Search Query</h2>
              </div>
              <p className="text-[15px] font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {query || "No text query provided."}
              </p>

              {attachedFile && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <i className="ph-fill ph-file-text text-purple-600 text-lg" />
                    <h3 className="text-sm font-bold text-slate-800">Attached Document</h3>
                  </div>
                  <div className="flex items-center gap-3 bg-purple-50/50 border border-purple-100 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-white border border-purple-200 flex items-center justify-center shrink-0 shadow-sm">
                      <i className="ph-fill ph-file-pdf text-purple-600 text-xl" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-800 truncate">{attachedFile.name}</span>
                      <span className="text-xs font-medium text-slate-500">
                        {(attachedFile.size / 1024).toFixed(1)} KB &bull; {attachedFile.type || "Document"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pb-24">
            {standards.map((std) => (
              <div
                key={std.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col transition-colors group"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-2 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {std.number}
                      </h3>
                      {std.status && (
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shrink-0 ${std.status.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {std.status}
                        </span>
                      )}
                    </div>
                    <p className="text-[15px] font-medium text-slate-600 leading-relaxed max-w-3xl">
                      {std.title}
                    </p>
                  </div>
                  {std.url && (
                    <a
                      href={std.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>View on BIS</span>
                      <i className="ph ph-arrow-up-right text-sm" />
                    </a>
                  )}
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-3 mt-3 pb-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">
                    <i className="ph ph-calendar-blank text-[14px] text-slate-400" />
                    {`Current Edition: ${std.edition}` || "Current Edition"}
                  </div>
                  {std.relevance != null && (
                    <div className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md border border-slate-200 ${getRelevanceColor(std.relevance)}`}>
                      {std.relevance}% Match
                    </div>
                  )}
                </div>

                {/* AI Overview */}
                {std.description && (
                  <div className="mb-5 bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ph-fill ph-sparkle text-blue-600 text-base" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Why This Standard</h4>
                    </div>
                    <p className="text-[13.5px] text-slate-700 leading-relaxed font-medium">
                      {std.description}
                    </p>
                  </div>
                )}

                {/* Details Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-100">
                  {/* Left Column: Certifications & Gaps */}
                  <div className="flex flex-col gap-5">
                    {/* Certifications */}
                    {(std.certifications && std.certifications.length > 0) && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <i className="ph-fill ph-certificate text-emerald-600 text-lg" />
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Certifications Required</h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          {std.certifications.map((cert) => (
                            <div key={cert.name} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
                              <span className="text-[13px] font-medium text-slate-700">{cert.name}</span>
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${cert.status === "APPLICABLE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                                {cert.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Params / Gaps */}
                    {(std.missingParams && std.missingParams.length > 0) && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <i className="ph-fill ph-warning-circle text-amber-500 text-lg" />
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Input's Gap Analysis</h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          {std.missingParams.map((item, index) => (
                            <div key={item} className="flex items-start gap-2 bg-amber-50/50 border border-amber-100/50 px-3 py-2 rounded-lg">
                              <span className="text-[13px] font-bold text-amber-600 mt-[1px]">{index + 1}.</span>
                              <span className="text-[13px] font-medium text-slate-700 leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Documents */}
                  <div className="flex flex-col gap-5">
                    {/* Amendments */}
                    {(std.amendments && std.amendments.length > 0) && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <i className="ph-fill ph-file-text text-blue-600 text-lg" />
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Amendments</h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          {std.amendments.map((amd, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg gap-2">
                              <span className="text-[13px] font-medium text-slate-700 truncate">{amd.label}</span>
                              {amd.downloadUrl && (
                                <a href={`https://bmqsdqljvwgm.compat.objectstorage.ap-mumbai-1.oraclecloud.com/${amd.downloadUrl}`} target="_blank" rel="noreferrer" className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 px-2 py-1 rounded text-slate-600 transition-colors">
                                  <i className="ph ph-download" /> PDF
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Gazette Notifications */}
                    {(std.gazetteDocuments && std.gazetteDocuments.length > 0) && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <i className="ph-fill ph-scroll text-purple-600 text-lg" />
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Gazette Notifications</h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          {std.gazetteDocuments.map((doc, i) => (
                            <div key={i} className="flex flex-col bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg gap-2">
                              <span className="text-[13px] font-medium text-slate-700">{doc.label}</span>
                              {doc.downloadUrls && doc.downloadUrls.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {doc.downloadUrls.map((url, j) => (
                                    <a key={j} href={`https://bmqsdqljvwgm.compat.objectstorage.ap-mumbai-1.oraclecloud.com/${url}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold uppercase bg-white border border-slate-200 hover:border-purple-300 hover:text-purple-600 px-2 py-1 rounded text-slate-600 transition-colors">
                                      <i className="ph ph-download" /> Doc {j + 1}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product Manuals */}
                    {(std.productManuals && std.productManuals.length > 0) && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <i className="ph-fill ph-book-open text-orange-600 text-lg" />
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Product Manuals</h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          {std.productManuals.map((man, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg gap-2">
                              <span className="text-[13px] font-medium text-slate-700 truncate">{man.label}</span>
                              {man.downloadUrl && (
                                <a href={`https://bmqsdqljvwgm.compat.objectstorage.ap-mumbai-1.oraclecloud.com/${man.downloadUrl}`} target="_blank" rel="noreferrer" className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase bg-white border border-slate-200 hover:border-orange-300 hover:text-orange-600 px-2 py-1 rounded text-slate-600 transition-colors">
                                  <i className="ph ph-download" /> PDF
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Empty state for details */}
                {(!std.certifications?.length && !std.missingParams?.length && !std.amendments?.length && !std.gazetteDocuments?.length && !std.productManuals?.length) && (
                  <div className="mt-4 py-6 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-slate-400">
                    <i className="ph ph-info text-2xl mb-2 text-slate-300" />
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">No additional details available</span>
                  </div>
                )}

              </div>
            ))}

            {/* Global Verified Badge at the bottom of the list */}
            {standards.length > 0 && (
              <div className="mt-4 flex items-center justify-center gap-2 text-[12px] font-bold text-emerald-700 bg-emerald-50/80 px-4 py-2.5 rounded-xl border border-emerald-200/60 max-w-fit mx-auto">
                <i className="ph-fill ph-seal-check text-lg" />
                <span className="uppercase tracking-wider">All standards are verified from BIS</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};
