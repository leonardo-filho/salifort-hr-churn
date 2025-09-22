import { useEffect, useState } from "react";
import BarChartSimple from "../components/BarChartSimple";
import BarChartGrouped from "../components/BarChartGrouped";
import {
  getSatisfactionHist,
  getTopDepartments,
  churnBySatisfaction,
  churnByProjects,
  churnByHours,
  churnByDeptSalary,
} from "../lib/api";

export default function EdaCharts() {
  const [satisfactionHist, setSatisfactionHist] = useState<any[]>([]);
  const [topDepartments, setTopDepartments] = useState<any[]>([]);
  const [churnBySat, setChurnBySat] = useState<any[]>([]);
  const [churnByProj, setChurnByProj] = useState<any[]>([]);
  const [churnByHrs, setChurnByHrs] = useState<any[]>([]);
  const [churnByDeptSal, setChurnByDeptSal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          hist,
          depts,
          churnSat,
          churnProj,
          churnHrs,
          churnDeptSal,
        ] = await Promise.all([
          getSatisfactionHist(),
          getTopDepartments(),
          churnBySatisfaction(),
          churnByProjects(),
          churnByHours(),
          churnByDeptSalary(),
        ]);
        setSatisfactionHist(hist);
        setTopDepartments(depts);
        setChurnBySat(churnSat);
        setChurnByProj(churnProj);
        setChurnByHrs(churnHrs);
        setChurnByDeptSal(churnDeptSal);
      } catch (e) {
        console.error(e);
        setError("Falha ao carregar gráficos EDA.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }
  if (loading) {
    return <div className="text-[color:var(--muted)]">Carregando gráficos…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Distribuição de satisfação */}
        <div className="card p-4 h-[360px]">
          <div className="section-title mb-2">Distribuição de satisfação</div>
          {satisfactionHist.length > 0 ? (
            <BarChartSimple
              data={satisfactionHist.map((d: any) => ({
                name: d.bin ?? d.name,
                value: d.count ?? d.value,
              }))}
              color="#38bdf8"
              yLabel="freq."
            />
          ) : (
            <div className="text-white/60 text-sm">
              Nenhum dado disponível (implemente o endpoint /eda/satisfaction_hist).
            </div>
          )}
        </div>

        {/* Taxa de evasão (churn) por satisfação */}
        <div className="card p-4 h-[360px]">
          <div className="section-title mb-2">Taxa de evasão × satisfação</div>
          {churnBySat.length > 0 ? (
            <BarChartSimple
              data={churnBySat}
              color="#f87171"
              yLabel="taxa (%)"
            />
          ) : (
            <div className="text-white/60 text-sm">
              Nenhum dado disponível (implemente o endpoint /eda/churn_by_satisfaction).
            </div>
          )}
        </div>

        {/* Taxa de evasão (churn) por número de projetos */}
        <div className="card p-4 h-[360px]">
          <div className="section-title mb-2">Taxa de evasão × nº projetos</div>
          {churnByProj.length > 0 ? (
            <BarChartSimple
              data={churnByProj}
              color="#e879f9"
              yLabel="taxa (%)"
            />
          ) : (
            <div className="text-white/60 text-sm">
              Nenhum dado disponível (implemente o endpoint /eda/churn_by_projects).
            </div>
          )}
        </div>

        {/* Taxa de evasão (churn) por carga horária */}
        <div className="card p-4 h-[360px]">
          <div className="section-title mb-2">Taxa de evasão × carga horária</div>
          {churnByHrs.length > 0 ? (
            <BarChartSimple
              data={churnByHrs}
              color="#facc15"
              yLabel="taxa (%)"
            />
          ) : (
            <div className="text-white/60 text-sm">
              Nenhum dado disponível (implemente o endpoint /eda/churn_by_hours).
            </div>
          )}
        </div>

        {/* Top departamentos */}
        <div className="card p-4 h-[360px]">
          <div className="section-title mb-2">Departamentos com maior saída</div>
          {topDepartments.length > 0 ? (
            <BarChartSimple
              data={topDepartments.map((d: any) => ({
                name: d.department ?? d.name,
                value: d.left_count ?? d.value,
              }))}
              color="#a78bfa"
              yLabel="saídas"
            />
          ) : (
            <div className="text-white/60 text-sm">
              Nenhum dado disponível (implemente o endpoint /eda/top_departments).
            </div>
          )}
        </div>

        {/* Taxa de evasão por Departamento × Salário */}
        <div className="card p-4 h-[360px]">
          <div className="section-title mb-2">
            Taxa de evasão por Departamento × Salário
          </div>
          {churnByDeptSal.length > 0 ? (
            <BarChartGrouped data={churnByDeptSal} />
          ) : (
            <div className="text-white/60 text-sm">
              Nenhum dado disponível (implemente o endpoint /eda/churn_by_dept_salary).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
