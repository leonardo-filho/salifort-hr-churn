import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { FiAlertCircle, FiArrowRight, FiCheck, FiRefreshCw } from "react-icons/fi";
import { demoRisk } from "../data/demo";
import { predict, type PredictRequest, type PredictResponse } from "../lib/api";

const initial: PredictRequest = {
  satisfaction_level: .55,
  last_evaluation: .60,
  number_project: 4,
  average_monthly_hours: 180,
  tenure: 3,
  work_accident: 0,
  promotion_last_5years: 0,
  department: "technical",
  salary: "medium",
};

const presets: { label: string; description: string; values: Partial<PredictRequest> }[] = [
  { label: "Perfil equilibrado", description: "4 projetos · 180h", values: { satisfaction_level: .72, number_project: 4, average_monthly_hours: 180, salary: "medium" } },
  { label: "Sobrecarga", description: "7 projetos · 290h", values: { satisfaction_level: .42, number_project: 7, average_monthly_hours: 290, salary: "low" } },
  { label: "Baixa alocação", description: "2 projetos · 135h", values: { satisfaction_level: .38, number_project: 2, average_monthly_hours: 135, salary: "medium" } },
];

const departments = [
  ["sales", "Vendas"], ["accounting", "Contabilidade"], ["hr", "Recursos humanos"],
  ["technical", "Técnico"], ["support", "Suporte"], ["management", "Gestão"],
  ["it", "Tecnologia"], ["product_mng", "Produto"], ["marketing", "Marketing"], ["randd", "Pesquisa e desenvolvimento"],
];

function riskMeta(probability: number) {
  if (probability >= .6) return { label: "Risco elevado", tone: "high", action: "Este cenário merece investigação prioritária dos fatores observados." };
  if (probability >= .3) return { label: "Risco moderado", tone: "medium", action: "Há sinais suficientes para acompanhar o contexto e testar alternativas." };
  return { label: "Risco reduzido", tone: "low", action: "O perfil está abaixo da faixa intermediária, sem eliminar a necessidade de contexto humano." };
}

function observedSignals(form: PredictRequest) {
  return [
    { label: "Satisfação", value: `${Math.round(form.satisfaction_level * 100)}%`, alert: form.satisfaction_level < .5 },
    { label: "Carga mensal", value: `${form.average_monthly_hours}h`, alert: form.average_monthly_hours < 150 || form.average_monthly_hours > 240 },
    { label: "Projetos", value: String(form.number_project), alert: form.number_project <= 2 || form.number_project >= 6 },
    { label: "Promoção recente", value: form.promotion_last_5years ? "Sim" : "Não", alert: !form.promotion_last_5years },
    { label: "Faixa salarial", value: ({ low: "Baixa", medium: "Média", high: "Alta" } as const)[form.salary], alert: form.salary === "low" },
  ];
}

export default function PredictForm() {
  const [form, setForm] = useState<PredictRequest>(initial);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [source, setSource] = useState<"model" | "demo" | null>(null);
  const [loading, setLoading] = useState(false);

  const meta = result ? riskMeta(result.probability) : null;
  const signals = useMemo(() => observedSignals(form), [form]);

  function update<K extends keyof PredictRequest>(key: K, value: PredictRequest[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setResult(null);
    setSource(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await predict(form);
      setResult(response);
      setSource("model");
    } catch {
      const probability = demoRisk(form);
      setResult({ probability, left_prediction: probability >= .5 ? 1 : 0 });
      setSource("demo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page page-lab">
      <header className="section-page-header lab-header">
        <div><p className="eyebrow">Simulação <span>03</span></p><h1>Teste um perfil.<br /><em>Questione o resultado.</em></h1></div>
        <p>Altere as condições e compare a probabilidade estimada com a taxa histórica da base. O resultado apoia investigação; não automatiza decisões sobre pessoas.</p>
      </header>

      <section className="preset-row" aria-label="Cenários predefinidos">
        <span>Cenários rápidos</span>
        {presets.map((preset) => <button type="button" key={preset.label} onClick={() => setForm({ ...initial, ...preset.values })}><strong>{preset.label}</strong><small>{preset.description}</small></button>)}
      </section>

      <form className="lab-grid" onSubmit={handleSubmit}>
        <div className="lab-controls">
          <fieldset>
            <legend>Engajamento</legend>
            <label className="range-field" htmlFor="satisfaction">
              <span>Nível de satisfação <output>{Math.round(form.satisfaction_level * 100)}%</output></span>
              <input id="satisfaction" type="range" min="0" max="1" step=".01" value={form.satisfaction_level} onChange={(event) => update("satisfaction_level", Number(event.target.value))} style={{ "--range-value": `${form.satisfaction_level * 100}%` } as CSSProperties} />
              <small><span>0</span><span>100</span></small>
            </label>
            <label className="range-field" htmlFor="evaluation">
              <span>Última avaliação <output>{Math.round(form.last_evaluation * 100)}%</output></span>
              <input id="evaluation" type="range" min="0" max="1" step=".01" value={form.last_evaluation} onChange={(event) => update("last_evaluation", Number(event.target.value))} style={{ "--range-value": `${form.last_evaluation * 100}%` } as CSSProperties} />
              <small><span>0</span><span>100</span></small>
            </label>
          </fieldset>

          <fieldset>
            <legend>Carga e contexto</legend>
            <div className="field-pair">
              <label>Projetos<input type="number" min="2" max="7" value={form.number_project} onChange={(event) => update("number_project", Number(event.target.value))} /></label>
              <label>Horas / mês<input type="number" min="80" max="320" value={form.average_monthly_hours} onChange={(event) => update("average_monthly_hours", Number(event.target.value))} /></label>
            </div>
            <div className="field-pair">
              <label>Anos na empresa<input type="number" min="1" max="10" value={form.tenure} onChange={(event) => update("tenure", Number(event.target.value))} /></label>
              <label>Departamento<select value={form.department} onChange={(event) => update("department", event.target.value)}>{departments.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            </div>
            <div className="field-pair">
              <label>Faixa salarial<select value={form.salary} onChange={(event) => update("salary", event.target.value as PredictRequest["salary"])}><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option></select></label>
              <label>Promoção em 5 anos<select value={form.promotion_last_5years} onChange={(event) => update("promotion_last_5years", Number(event.target.value) as 0 | 1)}><option value={0}>Não</option><option value={1}>Sim</option></select></label>
            </div>
          </fieldset>

          <button className="primary-action submit-risk" type="submit" disabled={loading}>
            {loading ? <><FiRefreshCw className="spin" /> Consultando modelo</> : <>Calcular risco <FiArrowRight /></>}
          </button>
        </div>

        <aside className={`risk-result ${meta ? `risk-${meta.tone}` : ""}`} aria-live="polite">
          {!result || !meta ? (
            <div className="result-empty">
              <span className="empty-orbit"><i /><i /></span>
              <p>Configure um cenário e calcule o risco para abrir a leitura comparativa.</p>
              <small>Referência da base: 23,8%</small>
            </div>
          ) : (
            <>
              <div className="result-heading"><span>{source === "model" ? "Modelo Random Forest" : "Estimativa demonstrativa"}</span><strong>{meta.label}</strong></div>
              <div className="risk-orb" style={{ "--risk": `${Math.round(result.probability * 100) * 3.6}deg` } as CSSProperties}>
                <div><strong>{(result.probability * 100).toFixed(1).replace(".", ",")}<small>%</small></strong><span>probabilidade estimada</span></div>
              </div>
              <div className="benchmark"><span>Base histórica <strong>23,8%</strong></span><i><b style={{ width: "23.8%" }} /></i></div>
              <p className="result-interpretation">{meta.action}</p>
              {source === "demo" && <p className="demo-disclaimer"><FiAlertCircle /> A API não respondeu. Esta estimativa local ilustra a interface e não substitui a previsão do modelo treinado.</p>}
            </>
          )}
        </aside>
      </form>

      <section className="signals-panel">
        <div><p className="section-index">Leitura do cenário</p><h2>Sinais observados no perfil</h2><p>Estas marcações descrevem entradas fora das zonas centrais da base. Não são explicações causais do modelo.</p></div>
        <ul>{signals.map((signal) => <li key={signal.label} className={signal.alert ? "is-alert" : ""}><span>{signal.alert ? <FiAlertCircle /> : <FiCheck />}{signal.label}</span><strong>{signal.value}</strong></li>)}</ul>
      </section>
    </div>
  );
}
