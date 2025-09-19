import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import KpiCard from "../components/KpiCard";
import BarChartSimple from "../components/BarChartSimple";

type PreviewResp = { rows: any[]; columns: string[]; count: number };
type MetricsResp = {
  churn_rate: number;
  avg_hours: number;
  avg_projects: number;
  hours_by_left: Record<string, number>;
  projects_hist: Record<string, number>;
  top_departments: Record<string, number>;
};

export default function Dashboard() {
  const [preview, setPreview] = useState<PreviewResp | null>(null);
  const [metrics, setMetrics] = useState<MetricsResp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, m] = await Promise.all([
        api.get<PreviewResp>("/dataset/preview?n=20"),
        api.get<MetricsResp>("/dataset/metrics"),
      ]);
      setPreview(p.data);
      setMetrics(m.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Carregando…</div>;

  return (
    <div style={{ padding: 24, color: "#e2e8f0", background: "#0a0f1a", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Dashboard — Dados brutos</h1>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
        <KpiCard title="Churn rate" value={`${(metrics!.churn_rate * 100).toFixed(1)}%`} />
        <KpiCard title="Horas/mês (média)" value={metrics!.avg_hours.toFixed(1)} />
        <KpiCard title="Projetos (média)" value={metrics!.avg_projects.toFixed(1)} />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ marginBottom: 8 }}>Horas médias — stayed vs left</div>
          <BarChartSimple
            data={Object.entries(metrics!.hours_by_left).map(([name, value]) => ({ name, value }))}
          />
        </div>
        <div>
          <div style={{ marginBottom: 8 }}>Distribuição — nº de projetos</div>
          <BarChartSimple
            data={Object.entries(metrics!.projects_hist).map(([name, value]) => ({ name, value }))}
          />
        </div>
      </div>

      {/* Tabela de preview */}
      <div style={{ background: "#0b1220", borderRadius: 12, padding: 12 }}>
        <div style={{ marginBottom: 8, fontWeight: 600 }}>Amostra do dataset (20 linhas de {preview!.count})</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {preview!.columns.map((c) => (
                  <th key={c} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #1f2937" }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview!.rows.map((r, i) => (
                <tr key={i}>
                  {preview!.columns.map((c) => (
                    <td key={c} style={{ padding: 8, borderBottom: "1px dashed #111827" }}>
                      {String(r[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
