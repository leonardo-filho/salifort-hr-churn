// src/routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PredictForm from "./pages/PredictForm";
import EdaCharts from "./pages/EdaCharts";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/predict" element={<PredictForm />} />
      <Route path="/eda" element={<EdaCharts />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
