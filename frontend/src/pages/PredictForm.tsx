// src/pages/PredictForm.tsx
import { useMemo, useState } from "react";

type PredictResponse = {
  left_prediction: number;     // 0 = fica, 1 = sai
  probability: number;         // prob de sair
};

const departments = [
  "sales","accounting","hr","technical","support","management",
  "it","product_mng","marketing","randd"
];

const salaries = ["low","medium","high"];

function RiskBadge({ p }: { p: number }) {
  // thresholds: <0.3 baixo, 0.3–0.6 médio, >0.6 alto
  const { label, bg, fg } = useMemo(() => {
    if (p > 0.6)  return { label: "Risco alto",  bg: "#fee2e2", fg: "#991b1b" };
    if (p >= 0.3) return { label: "Risco médio", bg: "#fef3c7", fg: "#92400e" };
    return { label: "Risco baixo", bg: "#dcfce7", fg: "#166534" };
  }, [p]);

  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: 12,
        fontWeight: 600,
      }}
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
      const base = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
      const res = await fetch(`${base}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} – ${text}`);
      }
      const data: PredictResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message ?? "Erro ao prever.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold">Previsão de Rotatividade</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coluna 1 */}
        <div className="card p-4 space-y-4">
          <div className="section-title">Engajamento</div>

          <label className="block">
            <div className="text-sm mb-1">Satisfaction level (0–1): {form.satisfaction_level.toFixed(2)}</div>
            <input
              type="range" min={0} max={1} step={0.01}
              value={form.satisfaction_level}
              onChange={(e) => update("satisfaction_level", Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="block">
            <div className="text-sm mb-1">Last evaluation (0–1): {form.last_evaluation.toFixed(2)}</div>
            <input
              type="range" min={0} max={1} step={0.01}
              value={form.last_evaluation}
              onChange={(e) => update("last_evaluation", Number(e.target.value))}
              className="w-full"
            />
          </label>

          <label className="block">
            <div className="text-sm mb-1">Promotion (últimos 5 anos)</div>
            <select
              value={form.promotion_last_5years}
              onChange={(e) => update("promotion_last_5years", Number(e.target.value) as 0|1)}
              className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2"
            >
              <option value={0}>Não</option>
              <option value={1}>Sim</option>
            </select>
          </label>

          <label className="block">
            <div className="text-sm mb-1">Acidente de trabalho</div>
            <select
              value={form.work_accident}
              onChange={(e) => update("work_accident", Number(e.target.value) as 0|1)}
              className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2"
            >
              <option value={0}>Não</option>
              <option value={1}>Sim</option>
            </select>
          </label>
        </div>

        {/* Coluna 2 */}
        <div className="card p-4 space-y-4">
          <div className="section-title">Carga de trabalho</div>

          <label className="block">
            <div className="text-sm mb-1">Number of projects</div>
            <input
              type="number" min={0}
              value={form.number_project}
              onChange={(e) => update("number_project", Number(e.target.value))}
              className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2"
            />
          </label>

          <label className="block">
            <div className="text-sm mb-1">Average monthly hours</div>
            <input
              type="number" min={0}
              value={form.average_monthly_hours}
              onChange={(e) => update("average_monthly_hours", Number(e.target.value))}
              className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2"
            />
          </label>

          <label className="block">
            <div className="text-sm mb-1">Tenure (anos na empresa)</div>
            <input
              type="number" min={0}
              value={form.tenure}
              onChange={(e) => update("tenure", Number(e.target.value))}
              className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2"
            />
          </label>
        </div>

        {/* Coluna 3 */}
        <div className="card p-4 space-y-4">
          <div className="section-title">Contexto</div>

          <label className="block">
            <div className="text-sm mb-1">Department</div>
            <select
              value={form.department}
              onChange={(e) => update("department", e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2"
            >
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>

          <label className="block">
            <div className="text-sm mb-1">Salary</div>
            <select
              value={form.salary}
              onChange={(e) => update("salary", e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2"
            >
              {salaries.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl px-4 py-2 font-semibold
                       bg-gradient-to-r from-sky-400 to-violet-500
                       hover:opacity-95 active:opacity-90 disabled:opacity-60"
          >
            {loading ? "Prevendo..." : "Prever"}
          </button>
        </div>
      </form>

      {/* Resultado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-4 lg:col-span-2">
          <div className="section-title mb-2">Resultado</div>

          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-red-200">
              {error}
            </div>
          )}

          {!error && !result && (
            <div className="text-[color:var(--muted)]">
              Preencha os campos e clique em <b>Prever</b> para ver o resultado.
            </div>
          )}

          {result && (
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm text-[color:var(--muted)] mb-1">
                  Probabilidade de sair
                </div>
                <div className="text-4xl font-extrabold">
                  {(result.probability * 100).toFixed(1)}%
                </div>
              </div>
              <RiskBadge p={result.probability} />
              <div className="ml-auto text-sm opacity-70">
                Predição: <b>{result.left_prediction === 1 ? "Sai" : "Fica"}</b>
              </div>
            </div>
          )}
        </div>

        {/* Dicas rápidas */}
        <div className="card p-4">
          <div className="section-title mb-2">Dicas</div>
          <ul className="list-disc pl-5 text-sm space-y-1 text-[color:var(--muted)]">
            <li>Use valores realistas (ex.: horas/mês entre 120–280).</li>
            <li>Tenure = anos de empresa.</li>
            <li>Salário/Departamento devem existir no dataset.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
