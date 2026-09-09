import { useState } from "react";
import { DataRow } from "../ui/DataRow";
import { FlatBadge } from "../ui/FlatBadge";
import type { Standard } from "../../types/standards";

interface CollapsibleStandardProps {
  std: Standard;
  isLast: boolean;
}

type TabType = "overview" | "compliance" | "documents";

export const CollapsibleStandard = ({
  std,
  isLast,
}: CollapsibleStandardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const complianceCount =
    (std.certifications?.length || 0) + (std.missingParams?.length || 0);
  const docsCount =
    (std.amendments?.length || 0) +
    (std.gazetteDocuments?.length || 0) +
    (std.productManuals?.length || 0);

  return (
    <div
      className={`transition-colors ${!isLast ? "border-b border-zinc-200" : ""
        } ${isExpanded ? "bg-zinc-50/40" : ""}`}
    >
      <div
        className="px-6 py-4 cursor-pointer group select-none hover:bg-zinc-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[17px] font-medium text-zinc-900 tracking-tight group-hover:text-zinc-700 transition-colors">
              {std.number}
            </span>
            <FlatBadge active={std.status === "active"}>{std.status}</FlatBadge>
          </div>
          <span className="text-zinc-400 group-hover:text-zinc-800 transition-colors flex-shrink-0 mt-[-4.5px]">
            <i className={`ph ph-caret-${isExpanded ? "up" : "down"} text-lg`} />
          </span>
        </div>
        <p className="text-[13px] font-medium text-zinc-600 leading-relaxed tracking-wide">
          {std.title}
        </p>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2 bg-white">
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl mb-5 gap-1 text-[12px]">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 text-center py-1.5 px-2 rounded-[10.5px] text-[12px] font-medium uppercase tracking-wider transition-colors ${activeTab === "overview"
                ? "bg-zinc-800 text-white"
                : "text-zinc-600 hover:text-zinc-900"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("compliance")}
              className={`flex-1 text-center py-1.5 px-2 rounded-[10.5px] font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${activeTab === "compliance"
                ? "bg-zinc-800 text-white"
                : "text-zinc-600 hover:text-zinc-900"
                }`}
            >
              Compliance
              {complianceCount > 0 && (
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${activeTab === "compliance"
                    ? "bg-zinc-700 text-white"
                    : "bg-zinc-200 text-zinc-700"
                    }`}
                >
                  {complianceCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`flex-1 text-center py-1.5 px-2 rounded-[10.5px] font-medium uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${activeTab === "documents"
                ? "bg-zinc-800 text-white"
                : "text-zinc-600 hover:text-zinc-900"
                }`}
            >
              Docs
              {docsCount > 0 && (
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${activeTab === "documents"
                    ? "bg-zinc-700 text-white"
                    : "bg-zinc-200 text-zinc-700"
                    }`}
                >
                  {docsCount}
                </span>
              )}
            </button>
          </div>

          {activeTab === "overview" && (
            <div>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <DataRow
                    icon="ph-calendar"
                    label="Current Edition"
                    value={std.edition}
                  />
                </div>
                {std.relevance !== undefined && (
                  <div className="flex-1">
                    <DataRow
                      icon="ph-percent"
                      label="Relevance"
                      value={`${std.relevance}%`}
                    />
                  </div>
                )}
              </div>
              <DataRow
                icon="ph-info"
                label="AI Overview"
                value={std.description}
              />
            </div>
          )}

          {activeTab === "compliance" && (
            <div>
              {std.certifications && std.certifications.length > 0 && (
                <div className="flex items-start gap-3 py-3 last:border-0 group">
                  <i className="ph ph-certificate text-xl text-zinc-800 group-hover:text-zinc-700 transition-colors mt-[-3.5px] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-zinc-900 uppercase tracking-wider mb-2">
                      Certifications
                    </div>
                    <div className="flex flex-col gap-2">
                      {std.certifications.map((cert) => (
                        <div
                          key={cert.name}
                          className="flex items-center justify-between group/item"
                        >
                          <span className="text-[14px] font-normal leading-relaxed text-zinc-600 tracking-wide pr-2">
                            {cert.name}
                          </span>
                          <FlatBadge active={cert.status === "APPLICABLE"}>
                            {cert.status}
                          </FlatBadge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {std.missingParams && std.missingParams.length > 0 && (
                <div className="flex items-start gap-3 py-3 last:border-0 group">
                  <i className="ph ph-list-magnifying-glass text-xl text-zinc-800 group-hover:text-zinc-700 transition-colors mt-[-3.5px] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-zinc-900 uppercase tracking-wider mb-2">
                      Gap Analysis (Missing Parameters)
                    </div>
                    <div className="flex flex-col gap-2">
                      {std.missingParams.map((item, index) => (
                        <div
                          key={item}
                          className="flex items-center justify-between group/item"
                        >
                          <span className="text-[14px] font-normal text-zinc-600 tracking-wide pr-2">
                            <span className="font-medium text-zinc-900 tracking-wider">{index + 1}.</span> {item}.
                          </span>
                          {/* <FlatBadge outline>MISSING</FlatBadge> */}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(!std.certifications || std.certifications.length === 0) &&
                (!std.missingParams || std.missingParams.length === 0) && (
                  <div className="py-8 text-center text-zinc-400">
                    <i className="ph ph-check-circle text-3xl mb-2 text-zinc-300 block" />
                    <p className="text-[12px] font-medium uppercase tracking-wider text-zinc-500">
                      No compliance data or missing parameters
                    </p>
                  </div>
                )}
            </div>
          )}

          {activeTab === "documents" && (
            <div>
              {std.amendments && std.amendments.length > 0 && (
                <div className="flex items-start gap-3 py-3 border-b border-zinc-100 last:border-0 group">
                  <i className="ph ph-file-text text-xl text-zinc-800 group-hover:text-zinc-700 transition-colors mt-[-3.5px] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-zinc-900 uppercase tracking-wider mb-2">
                      Amendments
                    </div>
                    <div className="flex flex-col gap-2">
                      {std.amendments.map((amendment, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between group/item"
                        >
                          <span className="text-[14px] font-normal text-zinc-600 tracking-wide truncate pr-2">
                            {amendment.label}
                          </span>
                          {amendment.downloadUrl && (
                            <a
                              href={`https://bmqsdqljvwgm.compat.objectstorage.ap-mumbai-1.oraclecloud.com/${amendment.downloadUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded transition-colors focus:outline-none flex-shrink-0"
                            >
                              <i className="ph ph-download-simple" />
                              PDF
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {std.gazetteDocuments && std.gazetteDocuments.length > 0 && (
                <div className="flex items-start gap-3 py-3 border-b border-zinc-100 last:border-0 group">
                  <i className="ph ph-scroll text-xl text-zinc-800 group-hover:text-zinc-700 transition-colors mt-[-3.5px] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-zinc-900 uppercase tracking-wider mb-2">
                      Gazette Notifications
                    </div>
                    <div className="flex flex-col gap-3">
                      {std.gazetteDocuments.map((doc, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-1.5 group/item"
                        >
                          <span className="text-[14px] font-normal text-zinc-600 tracking-wide">
                            {doc.label}
                          </span>
                          {doc.downloadUrls && doc.downloadUrls.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {doc.downloadUrls.map((url, j) => (
                                <a
                                  key={j}
                                  href={`https://bmqsdqljvwgm.compat.objectstorage.ap-mumbai-1.oraclecloud.com/${url}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-1 px-2.5 rounded transition-colors focus:outline-none"
                                >
                                  <i className="ph ph-download-simple" /> Doc {j + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {std.productManuals && std.productManuals.length > 0 && (
                <div className="flex items-start gap-3 py-3 border-b border-zinc-100 last:border-0 group">
                  <i className="ph ph-book-open text-xl text-zinc-800 group-hover:text-zinc-700 transition-colors mt-[-3.5px] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-zinc-900 uppercase tracking-wider mb-2">
                      Product Manuals
                    </div>
                    <div className="flex flex-col gap-2">
                      {std.productManuals.map((manual, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between group/item"
                        >
                          <span className="text-[14px] font-normal text-zinc-600 tracking-wide truncate pr-2">
                            {manual.label}
                          </span>
                          {manual.downloadUrl && (
                            <a
                              href={`https://bmqsdqljvwgm.compat.objectstorage.ap-mumbai-1.oraclecloud.com/${manual.downloadUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded transition-colors focus:outline-none flex-shrink-0"
                            >
                              <i className="ph ph-download-simple" />
                              PDF
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(!std.amendments || std.amendments.length === 0) &&
                (!std.gazetteDocuments || std.gazetteDocuments.length === 0) &&
                (!std.productManuals || std.productManuals.length === 0) && (
                  <div className="py-8 text-center text-zinc-400">
                    <i className="ph ph-files text-3xl mb-2 text-zinc-300 block" />
                    <p className="text-[12px] font-medium uppercase tracking-wider text-zinc-500">
                      No documents or attachments available
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
