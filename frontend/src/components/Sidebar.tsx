import { NavLink } from "react-router-dom";
import { FiActivity, FiBarChart2, FiGithub, FiGrid, FiX } from "react-icons/fi";

const items = [
  { to: "/dashboard", label: "Visão executiva", hint: "Panorama", icon: FiGrid },
  { to: "/eda", label: "Sinais de saída", hint: "Explorar", icon: FiBarChart2 },
  { to: "/predict", label: "Laboratório de risco", hint: "Simular", icon: FiActivity },
];

type Props = { isOpen?: boolean; onClose?: () => void };

export default function Sidebar({ isOpen = true, onClose }: Props) {
  return (
    <>
      <button
        type="button"
        className={`nav-scrim ${isOpen ? "is-open" : ""}`}
        onClick={onClose}
        aria-label="Fechar navegação"
        tabIndex={isOpen ? 0 : -1}
      />
      <aside className={`sidebar ${isOpen ? "is-open" : ""}`} aria-label="Navegação principal">
        <div>
          <div className="brand-lockup">
            <span className="brand-symbol" aria-hidden="true"><i /><i /><i /></span>
            <span><strong>Salifort</strong><small>People Risk Lab</small></span>
            <button type="button" className="icon-button close-nav" onClick={onClose} aria-label="Fechar menu"><FiX /></button>
          </div>

          <p className="sidebar-kicker">Inteligência de pessoas</p>
          <nav className="sidebar-nav">
            {items.map(({ to, label, hint, icon: Icon }, index) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                viewTransition
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                <span className="nav-index">0{index + 1}</span>
                <Icon aria-hidden="true" />
                <span><strong>{label}</strong><small>{hint}</small></span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <p>Capstone do certificado<br />Google Advanced Data Analytics</p>
          <a href="https://github.com/leonardo-filho/salifort-hr-churn" target="_blank" rel="noreferrer">
            <FiGithub aria-hidden="true" /> Ver código-fonte
          </a>
        </div>
      </aside>
    </>
  );
}
