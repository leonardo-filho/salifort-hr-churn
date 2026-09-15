import { FiMenu } from "react-icons/fi";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="topbar">
      <button type="button" className="icon-button menu-button" onClick={onMenuClick} aria-label="Abrir menu">
        <FiMenu />
      </button>
      <div className="topbar-context">
        <span className="status-dot" aria-hidden="true" />
        <span>Estudo demonstrativo</span>
        <span className="context-separator" />
        <span>14.999 registros</span>
      </div>
      <a className="author-link" href="https://leonardo-filho.vercel.app" target="_blank" rel="noreferrer">
        <span>Por</span> Leonardo Filho <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
