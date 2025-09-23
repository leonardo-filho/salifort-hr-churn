// src/App.tsx
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AppRoutes from "./routes";
import "./index.css";
console.log("Lendo VITE_API_URL:", import.meta.env.VITE_API_URL);
export default function App() {
  return (
    <div
      className="flex h-full"
      style={{
        background:
          "radial-gradient(1200px 600px at 85% -10%, rgba(14,165,233,.12), transparent), " +
          "radial-gradient(900px 600px at -10% 30%, rgba(139,92,246,.12), transparent), " +
          "var(--bg)",
      }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}
