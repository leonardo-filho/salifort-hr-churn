import { useLocation, Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

function titleFromPath(path: string) {
  if (path.startsWith("/predict")) return "Previsão de Rotatividade";
  if (path.startsWith("/eda")) return "Gráficos EDA";
  return "Dashboard — Dados brutos";
}

type Props = {
    onMenuClick: () => void;
};

export default function Topbar({ onMenuClick }: Props) {
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
        {/* Botão de Menu para mobile */}
        <button onClick={onMenuClick} className="lg:hidden text-white/80 hover:text-white transition-colors" aria-label="Abrir menu">
            <FaBars size={20} />
        </button>

        <Link to="/dashboard" className="text-xl font-semibold text-white/90 hidden sm:block">
          Salifort HR • <span className="text-white/70">Analytics</span>
        </Link>

        <div className="ml-auto text-white/90">
          Leonardo Filho
        </div>
      </div>

      <div className="px-6 md:px-8 pb-3 text-2xl font-bold text-white/90">
        {titleFromPath(pathname)}
      </div>
    </header>
  );
}

