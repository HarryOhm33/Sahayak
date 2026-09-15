import { useLocation, useNavigate, Link } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRecommendPage = location.pathname.startsWith("/recommend");

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/recommend", {
      state: { reset: true, timestamp: Date.now() },
    });
  };

  return (
    <header className="w-full border-b border-slate-200 bg-white relative z-50 flex-shrink-0 shadow-xs max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 focus:outline-none flex-shrink-0">
            
            {/* Sahayak Logo Icon Box */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-zinc-900 flex items-center justify-center shadow-xs transition-transform hover:scale-105 flex-shrink-0 p-1.5">
              <img src="/favicon.svg" alt="Sahayak Logo" className="w-full h-full object-contain" />
            </div>

            {/* Sahayak Title & Badge (hidden on phone view, visible on desktop view) */}
            <div className="mobile-hide desktop-show-flex flex-col leading-tight flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-zinc-900">
                  Sahayak
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
                  AI Engine
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium leading-none">
                Indian Standards Recommendation Platform
              </p>
            </div>

            {/* Divider (hidden on phone view, visible on desktop view) */}
            <div className="h-7 sm:h-8 w-[1px] bg-slate-200 mx-1 mobile-hide desktop-show-block flex-shrink-0" />

            {/* Satyamev Jayate Logo & Government Text (visible on both phone & desktop view) */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <img
                src="/satyamev-jayate.png"
                alt="Satyamev Jayate - Government of India"
                className="h-8 sm:h-10 w-auto object-contain flex-shrink-0"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] sm:text-[12px] font-bold text-slate-800 tracking-tight leading-none mb-0.5">
                  Government of India
                </span>
                <span className="text-[9px] sm:text-[11px] font-semibold text-slate-500 tracking-tight leading-none">
                  भारत सरकार
                </span>
              </div>
            </div>

          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          {/* Explore / New Analysis Button */}
          <button
            type="button"
            onClick={handleExploreClick}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex-shrink-0 group cursor-pointer"
          >
            <span>{isRecommendPage ? "New Analysis" : "Explore IS Engine"}</span>
            <i
              className={`ph-bold ${
                isRecommendPage ? "ph-plus" : "ph-arrow-right"
              } text-xs sm:text-base transition-transform group-hover:translate-x-0.5`}
            />
          </button>
        </div>

      </div>
    </header>
  );
};

export const Header = Navbar;

