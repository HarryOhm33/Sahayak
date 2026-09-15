import { Link } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export const DocumentsPage = () => {
  return (
    <div className="w-full h-full flex-1 bg-slate-50 text-slate-900 overflow-hidden font-sans flex flex-row relative">
      <Sidebar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
        <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-2xl p-8 shadow-sm flex flex-col items-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-4 shadow-2xs">
            <i className="ph ph-files text-3xl" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3">
            <i className="ph ph-sparkle text-xs" />
            <span>Feature Coming Soon</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2">
            Uploaded Document Vault
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
            Central repository for your uploaded tender documents, attached PDFs/DOCX, and extracted BIS normative reference standards.
          </p>

          <Link
            to="/recommend"
            className="w-full justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm shadow-blue-600/20 active:scale-95 cursor-pointer"
          >
            <i className="ph ph-sparkle text-sm" />
            <span>Back to Analyze</span>
          </Link>
        </div>
      </main>
    </div>
  );
};
