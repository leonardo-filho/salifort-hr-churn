import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiInfo } from "react-icons/fi";
import BarChartGrouped from "../components/BarChartGrouped";
import BarChartSimple from "../components/BarChartSimple";
import TrendChart from "../components/TrendChart";
import {
  demoChurnByHours,
  demoChurnByProjects,
  demoChurnBySatisfaction,
  demoDeptSalary,
  demoSatisfactionDistribution,
  demoTopDepartments,
} from "../data/demo";
import {
  churnByDeptSalary,
  churnByHours,
  churnByProjects,
  churnBySatisfaction,
  getSatisfactionHist,
  getTopDepartments,
  type DeptSalaryRow,
  type NamedValue,
} from "../lib/api";

type AnalysisData = {
  satisfaction: NamedValue[];
  satisfactionRisk: NamedValue[];
  projectRisk: NamedValue[];
  hoursRisk: NamedValue[];
  departments: NamedValue[];
  salaryRisk: DeptSalaryRow[];
};

const fallback: AnalysisData = {
  satisfaction: demoSatisfactionDistribution,
  satisfactionRisk: demoChurnBySatisfaction,
  projectRisk: demoChurnByProjects,
  hoursRisk: demoChurnByHours,
  departments: demoTopDepartments,
  salaryRisk: demoDeptSalary,
};

export default function EdaCharts() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      getSatisfactionHist(controller.signal),
      churnBySatisfaction(controller.signal),
      churnByProjects(controller.signal),
      churnByHours(controller.signal),
      getTopDepartments(controller.signal),
      churnByDeptSalary(controller.signal),
    ]).then(([satisfaction, satisfactionRisk, projectRisk, hoursRisk, departments, salaryRisk]) => {
      setData({ satisfaction, satisfactionRisk, projectRisk, hoursRisk, departments, salaryRisk });
    }).catch(() => {
      if (controller.signal.aborted) return;
      setData(fallback);
      setDemoMode(true);
    });
    return () => controller.abort();
  }, []);

  if (!data) return <div className="dashboard-skeleton" role="status"><span /><span /><span /></div>;

  return (
    <div className="page page-analysis">
      <header className="section-page-header">
        <div><p className="eyebrow">Exploração <span>02</span></p><h1>Onde o risco<br /><em>muda de forma.</em></h1></div>
        <p>Seis recortes para sair da correlação genérica e localizar os pontos em que satisfação, carga e remuneração mudam de comportamento.</p>
      </header>

      {demoMode && <div className="source-notice compact" role="status"><span>Modo demonstração</span><p>Agregados versionados do conjunto original.</p></div>}

      <section className="signal-strip" aria-label="Principais achados">
        <article><span>01</span><strong>78,2%</strong><p>de saída entre 280 e 319 horas/mês</p></article>
        <article><span>02</span><strong>100%</strong><p>de saída com sete projetos no conjunto</p></article>
        <article><span>03</span><strong>4,5×</strong><p>mais saída em salários baixos que altos</p></article>
      </section>

      <section className="analysis-grid">
        <article className="analysis-card analysis-wide">
          <div className="panel-heading"><div><span>Satisfação</span><h2>O risco tem dois vales — e dois picos.</h2></div><small>taxa de saída</small></div>
          <p className="chart-intro">A relação não é linear. Faixas muito baixas concentram saídas, mas há um segundo grupo de risco entre 0,3 e 0,5.</p>
          <TrendChart data={data.satisfactionRisk} ariaLabel="Taxa de saída por faixa de satisfação" />
        </article>

        <article className="analysis-card">
          <div className="panel-heading"><div><span>Alocação</span><h2>Projetos simultâneos</h2></div><small>% saída</small></div>
          <BarChartSimple data={data.projectRisk} ariaLabel="Taxa de saída por número de projetos" suffix="%" color="#d8ff34" />
          <p className="chart-footnote"><FiInfo /> Três e quatro projetos formam a zona de menor saída observada.</p>
        </article>

        <article className="analysis-card">
          <div className="panel-heading"><div><span>Carga</span><h2>Horas mensais</h2></div><small>% saída</small></div>
          <TrendChart data={data.hoursRisk} ariaLabel="Taxa de saída por faixa de horas mensais" />
          <p className="chart-footnote"><FiInfo /> Os extremos de carga exigem leituras diferentes, não uma meta única.</p>
        </article>

        <article className="analysis-card analysis-wide">
          <div className="panel-heading"><div><span>Contexto</span><h2>Salário muda o risco dentro da mesma área.</h2></div><small>% saída</small></div>
          <p className="chart-intro">A faixa salarial baixa aparece acima das demais em quase todos os departamentos. Isso é associação no conjunto, não prova de causalidade.</p>
          <BarChartGrouped data={data.salaryRisk} />
        </article>

        <article className="analysis-card">
          <div className="panel-heading"><div><span>Volume</span><h2>Saídas por departamento</h2></div><small>pessoas</small></div>
          <BarChartSimple data={data.departments.slice(0, 6)} ariaLabel="Quantidade de saídas por departamento" horizontal color="#ff7657" />
        </article>

        <article className="analysis-card">
          <div className="panel-heading"><div><span>Distribuição</span><h2>Níveis de satisfação</h2></div><small>pessoas</small></div>
          <BarChartSimple data={data.satisfaction} ariaLabel="Distribuição dos níveis de satisfação" color="#7d8b82" highlightMax={false} />
        </article>
      </section>

      <section className="analysis-cta">
        <div><span>Próximo passo</span><h2>Transforme padrões em um cenário.</h2></div>
        <Link className="primary-action" to="/predict" viewTransition>Abrir laboratório <FiArrowRight /></Link>
      </section>
    </div>
  );
}
