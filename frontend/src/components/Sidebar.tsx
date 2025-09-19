// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const base =
    "flex items-center gap-3 px-4 py-2 rounded-xl transition hover:bg-white/5";
  const active = "bg-white/10 text-white";

  return (
    <aside className="w-64 p-4 border-r border-white/10 hidden md:block">
      <div className="text-xl font-bold mb-6">Salifort HR</div>
      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) => `${base} ${isActive ? active : "text-[color:var(--muted)]"}`}
          end
        >
          <span>📊</span> Dashboard
        </NavLink>

        <NavLink
          to="/predict"
          className={({ isActive }) => `${base} ${isActive ? active : "text-[color:var(--muted)]"}`}
        >
          <span>🤖</span> Previsão
        </NavLink>
      </nav>
    </aside>
  );
}
