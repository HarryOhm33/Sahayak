import { Link, useNavigate } from "react-router-dom";

const SUGGESTED_PRODUCTS = [
  {
    title: "Distribution Transformer",
    query: "500 kVA, 11kV/433V outdoor distribution transformer for municipal substation use",
    category: "Electrical & Power",
    code: "IS 1180",
  },
  {
    title: "LED Street Lighting",
    query: "LED Street Lighting luminaires with surge protection for urban roads and highways",
    category: "Lighting & Electronics",
    code: "IS 10322",
  },
  {
    title: "Solar PV Modules",
    query: "Crystalline Silicon Terrestrial Photovoltaic (PV) Modules for utility solar projects",
    category: "Renewable Energy",
    code: "IS 14286",
  },
  {
    title: "Reinforced Concrete Pipes",
    query: "Precast reinforced concrete pipes for drainage culverts and sewerage works",
    category: "Civil & Infrastructure",
    code: "IS 458",
  },
];

const CAPABILITIES = [
  {
    icon: "ph-brain",
    title: "Semantic Context Matching",
    description:
      "Understands plain-English technical tender descriptions and automatically maps them to governing Indian Standards, overcoming terminology barriers.",
  },
  {
    icon: "ph-tree-structure",
    title: "Hierarchical Standards Graph",
    description:
      "Explores connected standards dynamically — linking base product specifications to normative references, safety codes, and mandatory testing methods.",
  },
  {
    icon: "ph-seal-check",
    title: "Mandatory Certifications",
    description:
      "Instantly identifies mandatory certifications like the BIS ISI Mark, BEE Star Rating, and Compulsory Registration Scheme (CRS) compliance.",
  },
  {
    icon: "ph-file-magnifying-glass",
    title: "Tender Gap Detection",
    description:
      "Upload specification documents or paste tenders to automatically detect missing electrical, civil, or performance parameters.",
  },
];

export const HomePage = () => {
  const navigate = useNavigate();

  const handleSelectQuery = (selectedQuery: string) => {
    navigate(`/recommend?q=${encodeURIComponent(selectedQuery)}`);
  };

  return (
    <div className="flex-1 bg-slate-50 text-slate-900 flex flex-col font-sans">
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 md:pt-20 pb-16 sm:pb-20 w-full flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-800 mb-5 sm:mb-6 max-w-full truncate shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="truncate">Bureau of Indian Standards &bull; Smart Tender Intelligence</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.15] mb-4 sm:mb-6">
          Intelligent Indian Standards & Tender Specification Engine
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8 sm:mb-10 font-medium">
          Empowering procurement officers, engineering departments, and auditors to instantly identify applicable IS codes, normative references, and mandatory certifications.
        </p>

        {/* Call to action buttons */}
        <div className="w-full max-w-2xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <Link
            to="/recommend"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <span>Launch Recommendation Canvas</span>
            <i className="ph ph-arrow-right text-sm sm:text-base flex-shrink-0" />
          </Link>
          <a
            href="#capabilities"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-white text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap bg-white/60"
          >
            <span>Explore Capabilities</span>
            <i className="ph ph-arrow-down text-xs sm:text-sm text-slate-400 flex-shrink-0" />
          </a>
        </div>

        {/* Sample Specifications Cards */}
        <div className="w-full max-w-4xl text-left mb-16 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 px-1">
            <div>
              <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
                Pre-configured Templates
              </div>
              <h3 className="text-base sm:text-[17px] font-extrabold text-slate-900">
                Explore Sample Product Specifications
              </h3>
            </div>
            <Link
              to="/recommend"
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View all on canvas</span>
              <i className="ph ph-caret-right text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {SUGGESTED_PRODUCTS.map((prod) => (
              <button
                key={prod.code}
                onClick={() => handleSelectQuery(prod.query)}
                type="button"
                className="group border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-md rounded-xl p-4 text-left transition-all cursor-pointer shadow-2xs flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {prod.title}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      {prod.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {prod.query}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full border border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0 text-slate-400 mt-0.5">
                  <i className="ph ph-arrow-up-right text-sm" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Capabilities Grid */}
        <div id="capabilities" className="w-full border-t border-slate-200/80 pt-14 sm:pt-20">
          <div className="text-center mb-10 sm:mb-12">
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 inline-block mb-2">
              Core Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Built for Tender Compliance & Specification Rigor
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="border border-slate-200/90 bg-white rounded-xl p-5 sm:p-6 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-4">
                  <i className={`ph ${cap.icon} text-2xl`} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {cap.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-bold text-slate-800">Bureau of Indian Standards</span>
            <span>&bull; DoCA, Govt. of India</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/recommend" className="hover:text-blue-700 transition-colors font-semibold">
              Launch Recommend Canvas
            </Link>
            <span className="text-slate-300">|</span>
            <span>Standards Copilot Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
