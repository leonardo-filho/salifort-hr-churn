// src/routes.tsx
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const PredictForm = lazy(() => import("./pages/PredictForm"));
const EdaCharts = lazy(() => import("./pages/EdaCharts"));

function RouteSkeleton() {
  return <div className="route-skeleton" role="status" aria-label="Carregando conteúdo"><span /><span /><span /></div>;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/predict" element={<PredictForm />} />
        <Route path="/eda" element={<EdaCharts />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
