import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AppRoutes from "./routes";
import "./index.css";

export default function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className="flex h-screen bg-[#0b1220] text-white"
      style={{
        background:
          "radial-gradient(1200px 600px at 85% -10%, rgba(14,165,233,.12), transparent), " +
          "radial-gradient(900px 600px at -10% 30%, rgba(139,92,246,.12), transparent), " +
          "var(--bg)",
      }}
    >

      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      <div className="lg:hidden">
         <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
      </div>

      {/* --- Conteúdo Principal --- */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

