import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Default to collapsed (true) so sidebar is closed by default on page load/refresh
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed((prev: boolean) => {
      const next = !prev;
      localStorage.setItem("sahayak_left_sidebar_collapsed", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const handleToggleEvent = () => {
      toggleCollapse();
    };
    window.addEventListener("toggleSidebar", handleToggleEvent);
    return () => {
      window.removeEventListener("toggleSidebar", handleToggleEvent);
    };
  }, []);

  // Close sidebar when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ignore click if it's on the toggle button itself
      if ((event.target as Element).closest('#navbar-sidebar-toggle')) {
        return;
      }
      
      if (
        !isCollapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsCollapsed(true);
        localStorage.setItem("sahayak_left_sidebar_collapsed", JSON.stringify(true));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCollapsed]);

  const navItems = [
    {
      label: "Analyze",
      icon: "ph-sparkle",
      path: "/recommend",
      badge: null,
    },
    {
      label: "History",
      icon: "ph-clock-counter-clockwise",
      path: "/recommend/history",
      badge: "Soon",
    },
    {
      label: "Documents",
      icon: "ph-files",
      path: "/recommend/documents",
      badge: "Soon",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay when open */}
      {!isCollapsed && (
        <div
          onClick={toggleCollapse}
          className="fixed inset-0 bg-black/20 backdrop-blur-2xs z-30 sm:hidden transition-opacity"
        />
      )}

      {/* Sidebar Overlay Container */}
      <div
        ref={sidebarRef}
        className={`absolute left-0 top-0 bottom-0 h-full z-40 select-none ${
          isCollapsed ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        {/* Main Sidebar Panel — Opens OVER content */}
        <aside
          className={`h-full bg-white flex flex-col justify-between transition-all duration-300 ease-in-out flex-shrink-0 min-h-0 overflow-hidden pointer-events-auto ${
            isCollapsed
              ? "w-0 px-0 py-4 border-r-0 opacity-0"
              : "w-52 sm:w-56 px-3 py-4 border-r border-slate-200 opacity-100"
          }`}
        >
          <div className="w-44 sm:w-48 flex flex-col justify-between h-full flex-shrink-0">
            <div className="flex flex-col gap-2.5">
              {/* Header Row with Inline Close Button */}
              <div className="flex items-center justify-between px-1 pb-1.5 border-b border-slate-100 min-h-[28px]">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest truncate">
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="w-6 h-6 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close Sidebar"
                >
                  <i className="ph ph-caret-left text-sm" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive = currentPath === item.path;

                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setIsCollapsed(true)}
                      className={`relative flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/90"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <i className={`ph ${item.icon} text-lg flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"}`} />
                        <span className="truncate font-semibold">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? "bg-blue-500 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Status Indicator */}
            <div className="pt-2.5 mt-2 border-t border-slate-100 px-1">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                <span className="truncate">Sahayak Copilot</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export const LeftRecommendSidebar = Sidebar;
