// src/components/Topbar.tsx
import { useLocation, Link } from "react-router-dom";

function titleFromPath(path: string) {
  if (path.startsWith("/predict")) return "Previsão de Rotatividade";
  if (path.startsWith("/eda")) return "Gráficos EDA";
  return "Dashboard — Dados brutos";
}

export default function Topbar() {
  const { pathname } = useLocation();

  return (
    <header
      className="sticky top-0 z-10 backdrop-blur-sm
                 border-b border-white/10"
      style={{
        background:
          "linear-gradient(180deg, rgba(11,18,32,.82), rgba(11,18,32,.55))",
      }}
    >
      <div className="px-6 md:px-8 py-4 flex items-center gap-4">
        <Link to="/dashboard" className="text-xl font-semibold text-white/90">
          Salifort HR • <span className="text-white/70">Analytics</span>
        </Link>

        <div className="ml-auto">
          Leonardo Filho
        </div>
      </div>

      <div className="px-6 md:px-8 pb-3 text-2xl font-bold text-white/90">
        {titleFromPath(pathname)}
      </div>
    </header>
  );
}
