import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Home", icon: "ph-house", path: "/" },
    { label: "Analyze", icon: "ph-magnifying-glass", path: "/recommend" },
    { label: "Tender Check", icon: "ph-file-check", path: "/tender-check" },
    { label: "Standards Map", icon: "ph-tree-structure", path: "/standards-map" },
    { label: "My Documents", icon: "ph-folder", path: "/documents" },
    { label: "History", icon: "ph-clock-counter-clockwise", path: "/history" },
  ];

  const bottomNavItems = [
    { label: "Help", icon: "ph-question", path: "#help" },
    { label: "Settings", icon: "ph-gear", path: "#settings" },
  ];

  return (
    <aside className="w-16 md:w-56 border-r border-slate-200 bg-white flex flex-col justify-between py-4 px-2 md:px-3 flex-shrink-0 min-h-0 select-none">
      {/* Main Navigation Links */}
      <div className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive =
            currentPath === item.path ||
            (item.path === "/recommend" && currentPath === "/recommend") ||
            (item.path === "/standards-map" && currentPath === "/recommend");

          return (
            <Link
              key={item.label}
              to={item.path === "/standards-map" ? "/recommend" : item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
              title={item.label}
            >
              <i className={`ph ${item.icon} text-lg flex-shrink-0`} />
              <span className="hidden md:inline-block">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Utility Links */}
      <div className="flex flex-col gap-1 pt-4 border-t border-slate-200">
        {bottomNavItems.map((item) => (
          <a
            key={item.label}
            href={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs md:text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={item.label}
          >
            <i className={`ph ${item.icon} text-lg flex-shrink-0`} />
            <span className="hidden md:inline-block">{item.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
};
