import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AppRoutes from "./routes";
import "./index.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <div className="desktop-sidebar">
        <Sidebar />
      </div>
      <div className="mobile-sidebar">
         <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
      </div>
      <div className="app-frame">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main id="main-content" className="app-main">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}
