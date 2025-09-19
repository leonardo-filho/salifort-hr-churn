// src/components/Sidebar.tsx
import { useState } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("dashboard");

  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "dataset", label: "Dataset" },
    { key: "models", label: "Modelos" },
    { key: "predictions", label: "Previsões" },
  ];

  return (
    <aside className="sidebar-bg w-64 min-h-screen px-4 py-5 border-r border-white/10 flex flex-col">
      <div className="text-xl font-bold mb-6">Salifort HR</div>
      <nav className="flex-1 space-y-1">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => setActive(it.key)}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              active === it.key
                ? "bg-white/10 text-white font-semibold"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            {it.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
