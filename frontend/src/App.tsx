// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PredictForm from "./pages/PredictForm";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function App() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-4 md:p-6 space-y-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<PredictForm />} />
            {/* fallback: manda pra home se rota não existir */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
