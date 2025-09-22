import { NavLink } from "react-router-dom";
import { FaChartBar, FaSearch, FaTachometerAlt } from "react-icons/fa";

// Você precisará instalar o react-icons: npm install react-icons
const items = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/predict", label: "Previsão", icon: <FaSearch /> },
  { to: "/eda", label: "Gráficos EDA", icon: <FaChartBar /> },
];

export default function Sidebar() {
  return (
    <aside
      className="w-64 shrink-0 border-r border-white/10 relative p-6 flex flex-col justify-between"
      style={{
        background:
          "radial-gradient(600px 200px at 0% 0%, rgba(14,165,233,.10), transparent 60%), " +
          "radial-gradient(600px 260px at 120% 120%, rgba(139,92,246,.10), transparent 60%), " +
          "#0b1220",
      }}
    >
      <div className="flex-1 flex flex-col justify-start">
        <div className="flex items-center gap-2 mb-8 text-white/90 font-bold text-xl tracking-wide">
          <span className="text-blue-400">📊</span> Salifort HR
        </div>

        <nav className="flex-1 space-y-2">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-lg transition",
                  isActive
                    ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.06)]"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
              end
            >
              <span className="text-xl">{i.icon}</span>
              {i.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-6 left-0 w-full text-center px-5 text-xs text-white/40">
        Google Advanced Data Analytics — Capstone
      </div>
    </aside>
  );
}
