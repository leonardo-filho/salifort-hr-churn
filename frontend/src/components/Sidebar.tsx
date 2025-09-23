import { NavLink } from "react-router-dom";
import { FaChartBar, FaSearch, FaTachometerAlt, FaTimes } from "react-icons/fa";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/predict", label: "Previsão", icon: <FaSearch /> },
  { to: "/eda", label: "Gráficos EDA", icon: <FaChartBar /> },
];

// O componente agora aceita props para controlar o estado
type Props = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen = true, onClose }: Props) {
  // A classe base para o <aside>
  const asideClasses =
    "w-64 border-r border-white/10 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out";

  // Estilos para o fundo
  const asideStyle = {
    background:
      "radial-gradient(600px 200px at 0% 0%, rgba(14,165,233,.10), transparent 60%), " +
      "radial-gradient(600px 260px at 120% 120%, rgba(139,92,246,.10), transparent 60%), " +
      "#0b1220",
  };

  return (
    <>
      {/* Overlay (fundo escuro) para o modo mobile */}
      {/* Aparece apenas em mobile (lg:hidden) quando o menu está aberto */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`${asideClasses} ${
          // No mobile, a sidebar é fixa e controlada pelo estado 'isOpen'
          // A classe 'lg:relative' a torna parte do layout normal em telas grandes
          `fixed inset-y-0 left-0 z-30 lg:relative lg:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`
        }`}
        style={asideStyle}
      >
        <div className="flex-1 flex flex-col justify-start">
          <div className="flex items-center justify-between gap-2 mb-8 text-white/90 font-bold text-xl tracking-wide">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📊</span> Salifort HR
            </div>
            {/* Botão de fechar (só para mobile) */}
            <button
              onClick={onClose}
              className="lg:hidden text-white/70 hover:text-white"
              aria-label="Fechar menu"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {items.map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                onClick={onClose} // Fecha o menu ao clicar em um item
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

        <div className="text-center px-5 text-xs text-white/40">
          Google Advanced Data Analytics — Capstone
        </div>
      </aside>
    </>
  );
}

