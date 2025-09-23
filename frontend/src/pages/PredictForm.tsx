import { useMemo, useState } from "react";
import { predict } from "../lib/api";

type PredictResponse = {
  left_prediction: number;     // 0 = fica, 1 = sai
  probability: number;         // prob de sair
};

const departments = [
  "sales", "accounting", "hr", "technical", "support", "management",
  "it", "product_mng", "marketing", "randd"
];

const salaries = ["low", "medium", "high"];

function RiskBadge({ p }: { p: number }) {
  const { label, bg, fg } = useMemo(() => {
    if (p > 0.6) return { label: "Risco alto", bg: "bg-red-400/20", fg: "text-red-300" };
    if (p >= 0.3) return { label: "Risco médio", bg: "bg-yellow-400/20", fg: "text-yellow-300" };
    return { label: "Risco baixo", bg: "bg-green-400/20", fg: "text-green-300" };
  }, [p]);

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${bg} ${fg}`}
    >
      {label}
    </span>
  );
}

export default function PredictForm() {
  const [form, setForm] = useState({
    satisfaction_level: 0.55,
    last_evaluation: 0.60,
    number_project: 4,
    average_monthly_hours: 180,
    tenure: 3,
    work_accident: 0,
    promotion_last_5years: 0,
    department: "technical",
    salary: "medium",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data: PredictResponse = await predict(form as any);
      setResult(data);
    } catch (err: any) {
      setError(err?.message ?? "Erro ao prever.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Previsão de Rotatividade</h1>
      <p className="text-lg text-white/70">
        Insira as características do funcionário para prever a probabilidade de rotatividade.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 */}
        <div className="card p-6 space-y-6">
          <div className="section-title">Engajamento</div>

          <label className="block">
            <div className="text-sm mb-2 text-white/80">Nível de Satisfação (0–1): <span className="font-semibold text-white">{form.satisfaction_level.toFixed(2)}</span></div>
            <input
              type="range" min={0} max={1} step={0.01}
              value={form.satisfaction_level}
              onChange={(e) => update("satisfaction_level", Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              style={{ backgroundSize: `${form.satisfaction_level * 100}% 100%` }}
            />
          </label>

          <label className="block">
            <div className="text-sm mb-2 text-white/80">Última Avaliação (0–1): <span className="font-semibold text-white">{form.last_evaluation.toFixed(2)}</span></div>
            <input
              type="range" min={0} max={1} step={0.01}
              value={form.last_evaluation}
              onChange={(e) => update("last_evaluation", Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              style={{ backgroundSize: `${form.last_evaluation * 100}% 100%` }}
            />
          </label>

          <label className="block">
            <div className="text-sm mb-2 text-white/80">Promoção (últimos 5 anos)</div>
            <div className="relative">
              <select
                value={form.promotion_last_5years}
                onChange={(e) => update("promotion_last_5years", Number(e.target.value) as 0 | 1)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/90 appearance-none pr-8 transition-colors hover:bg-white/10 focus:ring-2 focus:ring-blue-500"
              >
                <option value={0} className="bg-[#0c1322] text-white">Não</option>
                <option value={1} className="bg-[#0c1322] text-white">Sim</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/50">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l4 4z"/></svg>
              </div>
            </div>
          </label>

          <label className="block">
            <div className="text-sm mb-2 text-white/80">Acidente de trabalho</div>
            <div className="relative">
              <select
                value={form.work_accident}
                onChange={(e) => update("work_accident", Number(e.target.value) as 0 | 1)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/90 appearance-none pr-8 transition-colors hover:bg-white/10 focus:ring-2 focus:ring-blue-500"
              >
                <option value={0} className="bg-[#0c1322] text-white">Não</option>
                <option value={1} className="bg-[#0c1322] text-white">Sim</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/50">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l4 4z"/></svg>
              </div>
            </div>
          </label>
        </div>

        {/* Coluna 2 */}
        <div className="card p-6 space-y-6">
          <div className="section-title">Carga de trabalho</div>

          <label className="block">
            <div className="text-sm mb-2 text-white/80">Nº de Projetos</div>
            <input
              type="number" min={0}
              value={form.number_project}
              onChange={(e) => update("number_project", Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white transition-colors hover:bg-white/10 focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block">
            <div className="text-sm mb-2 text-white/80">Horas médias/mês</div>
            <input
              type="number" min={0}
              value={form.average_monthly_hours}
              onChange={(e) => update("average_monthly_hours", Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white transition-colors hover:bg-white/10 focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block">
            <div className="text-sm mb-2 text-white/80">Anos na empresa</div>
            <input
              type="number" min={0}
              value={form.tenure}
              onChange={(e) => update("tenure", Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white transition-colors hover:bg-white/10 focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Coluna 3 */}
        <div className="card p-6 space-y-6">
          <div className="section-title">Contexto</div>

          <label className="block">
            <div className="text-sm mb-2 text-white/80">Departamento</div>
            <div className="relative">
              <select
                value={form.department}
                onChange={(e) => update("department", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/90 appearance-none pr-8 transition-colors hover:bg-white/10 focus:ring-2 focus:ring-blue-500"
              >
                {departments.map((d) => <option key={d} value={d} className="bg-[#0c1322] text-white">{d}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/50">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l4 4z"/></svg>
              </div>
            </div>
          </label>

          <label className="block">
            <div className="text-sm mb-2 text-white/80">Salário</div>
            <div className="relative">
              <select
                value={form.salary}
                onChange={(e) => update("salary", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/90 appearance-none pr-8 transition-colors hover:bg-white/10 focus:ring-2 focus:ring-blue-500"
              >
                {salaries.map((s) => <option key={s} value={s} className="bg-[#0c1322] text-white">{s}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/50">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l4 4z"/></svg>
              </div>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl px-4 py-3 font-semibold text-white
                       bg-gradient-to-r from-sky-500 to-violet-600
                       hover:opacity-95 active:opacity-90 disabled:opacity-60 transition-colors"
          >
            {loading ? "Prevendo..." : "Prever"}
          </button>
        </div>
      </form>

      {/* Resultado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <div className="section-title mb-4">Resultado da Previsão</div>
          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-red-200">
              {error}
            </div>
          )}

          {!error && !result && (
            <div className="text-center text-white/50 py-10">
              <p>Preencha os campos e clique em <b>Prever</b> para ver o resultado.</p>
            </div>
          )}

          {result && (
            <div className="flex items-center gap-6">
              <div>
                <div className="text-sm text-white/50 mb-1">
                  Probabilidade de sair
                </div>
                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-500">
                  {(result.probability * 100).toFixed(1)}%
                </div>
              </div>
              <RiskBadge p={result.probability} />
              <div className="ml-auto text-sm text-white/50">
                Predição: <b className="text-white">{result.left_prediction === 1 ? "Sai" : "Fica"}</b>
              </div>
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="section-title mb-4">Dicas</div>
          <ul className="list-disc pl-5 text-sm space-y-2 text-white/60">
            <li>Use valores realistas (ex.: horas/mês entre 120–280).</li>
            <li>Tenure = anos de empresa.</li>
            <li>Os valores devem ser baseados no dataset de treinamento do modelo.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
