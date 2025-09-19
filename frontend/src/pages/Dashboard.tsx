// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { getMetrics, getPreview } from "../lib/api";
import KpiCard from "../components/KpiCard";
import BarChartSimple from "../components/BarChartSimple";
import DataTable from "../components/DataTable";

type Metrics = {
  churn_rate?: number;
  avg_hours?: number;
  avg_projects?: number;
  hours_by_left?: Record<string, number>;
  projects_hist?: Record<string, number>;
  top_departments?: Record<string, number>;
};

type Preview = {
  rows: any[];
  columns: string[];
  count: number;
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const m = await getMetrics();
        const p = await getPreview(200); // pega mais linhas p/ paginação da tabela
        setMetrics(m);
        setPreview(p);
      } catch (e) {
        console.error(e);
        setError("Falha ao carregar dados do backend.");
      }
    })();
  }, []);

  if (error) {
    return <div className="text-[color:var(--muted)]">{error}</div>;
  }
  if (!metrics || !preview) {
    return <div className="text-[color:var(--muted)]">Carregando…</div>;
  }

  // Fallbacks seguros
  const churn = Number(metrics.churn_rate ?? 0);
  const avgH = Number(metrics.avg_hours ?? 0);
  const avgP = Number(metrics.avg_projects ?? 0);
  const hoursByLeft = metrics.hours_by_left ?? {};
  const projectsHist = metrics.projects_hist ?? {};

  const hoursData = [
    { name: "stayed", value: Number(hoursByLeft["0"] ?? hoursByLeft.stayed ?? 0) },
    { name: "left", value: Number(hoursByLeft["1"] ?? hoursByLeft.left ?? 0) },
  ];

  const projectsData = Object.entries(projectsHist).map(([k, v]) => ({
    name: String(k),
    value: Number(v),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold">Dashboard — Dados brutos</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard title="Churn rate" value={`${(churn * 100).toFixed(1)}%`} />
        <KpiCard title="Horas/mês (média)" value={avgH.toFixed(1)} />
        <KpiCard title="Projetos (média)" value={avgP.toFixed(1)} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="section-title mb-2">Horas médias — stayed vs left</div>
          <BarChartSimple data={hoursData} color="#38bdf8" yLabel="horas" />
        </div>

        <div className="card p-4">
          <div className="section-title mb-2">Distribuição — nº de projetos</div>
          <BarChartSimple data={projectsData} color="#a78bfa" yLabel="freq." />
        </div>
      </div>

      {/* Tabela */}
      <DataTable
        columns={preview.columns}
        rows={preview.rows}
        total={preview.count}
      />
    </div>
  );
}
