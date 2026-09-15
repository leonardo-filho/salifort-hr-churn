import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiBriefcase, FiClock, FiDatabase, FiTrendingDown } from "react-icons/fi";
import BarChartSimple from "../components/BarChartSimple";
import DataTable from "../components/DataTable";
import KpiCard from "../components/KpiCard";
import { demoMetrics, demoPreview } from "../data/demo";
import { getMetrics, getPreview, type DatasetMetrics, type PreviewResponse } from "../lib/api";

type SourceMode = "live" | "demo";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DatasetMetrics | null>(null);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [mode, setMode] = useState<SourceMode>("live");

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([getMetrics(controller.signal), getPreview(24, controller.signal)])
      .then(([metricsResult, previewResult]) => {
        setMetrics(metricsResult);
        setPreview(previewResult);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setMetrics(demoMetrics);
        setPreview(demoPreview);
        setMode("demo");
      });
    return () => controller.abort();
  }, []);

  const derived = useMemo(() => {
    if (!metrics) return null;
    const hours = metrics.hours_by_left ?? {};
    return {
      departures: Math.round(metrics.count * metrics.churn_rate),
      hoursData: [
        { name: "Permaneceu", value: Number(hours.stayed ?? hours["0"] ?? 0) },
        { name: "Saiu", value: Number(hours.left ?? hours["1"] ?? 0) },
      ],
      projectsData: Object.entries(metrics.projects_hist ?? {}).map(([name, value]) => ({ name, value: Number(value) })),
    };
  }, [metrics]);

  if (!metrics || !preview || !derived) {
    return <div className="dashboard-skeleton" role="status"><span /><span /><span /><span /></div>;
  }

  return (
    <div className="page page-dashboard">
      <header className="page-hero">
        <div className="hero-copy">
          <p className="eyebrow">Visão executiva <span>01</span></p>
          <h1>Rotatividade não é um número.<br /><em>É um sistema de sinais.</em></h1>
          <p className="hero-lede">Uma leitura orientada à decisão sobre carga, satisfação e contexto profissional de 14.999 pessoas.</p>
          <div className="hero-actions">
            <Link className="primary-action" to="/predict" viewTransition>Simular um perfil <FiArrowRight /></Link>
            <Link className="text-action" to="/eda" viewTransition>Explorar os sinais</Link>
          </div>
        </div>
        <div className="hero-stat" aria-label={`${(metrics.churn_rate * 100).toFixed(1)} por cento de taxa histórica de saída`}>
          <span>Taxa histórica de saída</span>
          <strong>{(metrics.churn_rate * 100).toFixed(1).replace(".", ",")}<small>%</small></strong>
          <div className="risk-scale"><i /><i /><i /><i /><i /></div>
          <p>{derived.departures.toLocaleString("pt-BR")} saídas observadas no conjunto.</p>
        </div>
      </header>

      {mode === "demo" && (
        <div className="source-notice" role="status">
          <span>Modo demonstração</span>
          <p>A API está temporariamente indisponível. Os indicadores abaixo usam os agregados versionados do mesmo conjunto de dados.</p>
        </div>
      )}

      <section className="metrics-grid" aria-label="Indicadores principais">
        <KpiCard label="Base analisada" value={metrics.count.toLocaleString("pt-BR")} detail="registros anonimizados" icon={FiDatabase} tone="acid" />
        <KpiCard label="Saídas observadas" value={derived.departures.toLocaleString("pt-BR")} detail="23,8% da população" icon={FiTrendingDown} tone="risk" />
        <KpiCard label="Carga média" value={`${metrics.avg_hours.toFixed(0)}h`} detail="por pessoa / mês" icon={FiClock} />
        <KpiCard label="Projetos simultâneos" value={metrics.avg_projects.toFixed(1).replace(".", ",")} detail="média do conjunto" icon={FiBriefcase} />
      </section>

      <section className="narrative-grid">
        <article className="insight-panel insight-lead">
          <p className="section-index">Leitura 01</p>
          <h2>Os extremos concentram o risco.</h2>
          <p>Pessoas com dois ou sete projetos apresentam as maiores taxas de saída. O comportamento não é linear: pouca alocação e sobrecarga podem ser sinais diferentes do mesmo problema.</p>
          <Link to="/eda" viewTransition>Ver evidências <FiArrowRight /></Link>
        </article>
        <article className="chart-panel">
          <div className="panel-heading"><div><span>Distribuição</span><h3>Pessoas por número de projetos</h3></div><small>pessoas</small></div>
          <BarChartSimple data={derived.projectsData} ariaLabel="Distribuição de pessoas por número de projetos" color="#d8ff34" highlightMax={false} />
        </article>
      </section>

      <section className="narrative-grid narrative-reverse">
        <article className="chart-panel">
          <div className="panel-heading"><div><span>Comparação</span><h3>Carga média por desfecho</h3></div><small>horas/mês</small></div>
          <BarChartSimple data={derived.hoursData} ariaLabel="Comparação de horas médias entre pessoas que permaneceram e saíram" color="#ff7657" horizontal suffix="h" highlightMax />
        </article>
        <article className="insight-panel">
          <p className="section-index">Leitura 02</p>
          <h2>A média esconde a curva.</h2>
          <p>Quem saiu trabalhou, em média, apenas oito horas a mais por mês. A diferença parece pequena até abrirmos as faixas: acima de 280 horas, a saída salta para 78,2%.</p>
        </article>
      </section>

      <section className="dataset-section">
        <div className="section-heading">
          <div><p className="eyebrow">Rastreabilidade <span>04</span></p><h2>Do indicador ao registro.</h2></div>
          <p>Amostra dos dados públicos usados na análise. O conjunto representa um estudo, não pessoas identificáveis.</p>
        </div>
        <DataTable columns={preview.columns} rows={preview.rows} total={preview.count} />
      </section>
    </div>
  );
}
