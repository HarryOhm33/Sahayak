import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="flex-1 bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-12 font-sans select-none">
      <main className="max-w-md w-full bg-white border border-slate-200/90 rounded-2xl p-8 shadow-sm text-center flex flex-col items-center animate-fade-in">
        {/* Emblem & Logo Header */}
        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center p-2.5 shadow-md mb-4">
          <img src="/favicon.svg" alt="Sahayak Logo" className="w-full h-full object-contain" />
        </div>

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-extrabold uppercase tracking-wider mb-3">
          <i className="ph ph-warning-circle text-sm" />
          <span>Error 404 &bull; Page Not Found</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
          Route Does Not Exist
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-8 max-w-sm">
          The requested page or Indian Standards URL does not exist or may have been relocated.
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            to="/"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <i className="ph ph-house text-sm" />
            <span>Go to Home</span>
          </Link>
          <Link
            to="/recommend"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-600/20 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <i className="ph ph-sparkle text-sm" />
            <span>Analyze Standards</span>
          </Link>
        </div>
      </main>
    </div>
  );
};
