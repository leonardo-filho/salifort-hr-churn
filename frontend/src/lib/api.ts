// src/lib/api.ts
import axios, { AxiosError } from "axios";

/* =========================
 * Config & Instância Axios
 * ========================= */
const RAW_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "");
export const BASE_URL = RAW_BASE || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de resposta: sempre retornar .data e normalizar erros
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<unknown>) => {
    const status = err.response?.status;
    const payload = err.response?.data;
    const detail = typeof payload === "object" && payload !== null && "detail" in payload
      ? String((payload as { detail: unknown }).detail)
      : undefined;
    const message =
      detail ||
      err.message ||
      "Erro de rede ao conversar com o backend.";
    return Promise.reject({ status, message });
  }
);

/* ===============
 * Tipagens úteis
 * =============== */
export type DatasetMetrics = {
  count: number;
  churn_rate: number;
  avg_hours: number;
  avg_projects: number;
  hours_by_left: Record<string, number>;   // {"0": x, "1": y}
  projects_hist: Record<string, number>;   // {"2": 1800, ...}
  top_departments?: Record<string, number>;
  salary_dist?: Record<string, number>;
};

export type PreviewResponse = {
  rows: Record<string, string | number>[]; // array de linhas
  columns: string[];                        // nomes de colunas
  count: number;                            // total no dataset
};

export type NamedValue = { name: string; value: number };
export type DeptSalaryRow = { name: string; low: number; medium: number; high: number };

export type PredictRequest = {
  satisfaction_level: number;
  last_evaluation: number;
  number_project: number;
  average_monthly_hours: number;
  tenure: number; // anos na empresa
  work_accident: 0 | 1;
  promotion_last_5years: 0 | 1;
  department: string;
  salary: "low" | "medium" | "high";
};

export type PredictResponse = {
  left_prediction: 0 | 1;
  probability: number; // 0..1
};

/* ======================
 * Helper genérico (data)
 * ====================== */
const dataOf = async <T>(p: Promise<{ data: T }>) => (await p).data;

/* ============
 * Dataset API
 * ============ */
export const getMetrics = (signal?: AbortSignal) =>
  dataOf<DatasetMetrics>(api.get("/dataset/metrics", { signal }));

export const getPreview = (n = 20, signal?: AbortSignal) =>
  dataOf<PreviewResponse>(api.get(`/dataset/preview?n=${n}`, { signal }));

/* =======
 * EDA API
 * ======= */
export const getSatisfactionHist = (signal?: AbortSignal) =>
  dataOf<NamedValue[]>(
    api.get("/eda/satisfaction_hist", { signal })
  );

/** Se você ainda não criou esse endpoint no backend, basta retornar
 *  algo como [{name:'sales', value:123}, ...] */
export const getTopDepartments = (signal?: AbortSignal) =>
  dataOf<NamedValue[]>(
    api.get("/eda/top_departments", { signal })
  );

// Gráficos adicionais (seu notebook → backend)
export const churnBySatisfaction = (signal?: AbortSignal) =>
  dataOf<NamedValue[]>(api.get("/eda/churn_by_satisfaction", { signal }));

export const churnByProjects = (signal?: AbortSignal) =>
  dataOf<NamedValue[]>(api.get("/eda/churn_by_projects", { signal }));

export const churnByHours = (signal?: AbortSignal) =>
  dataOf<NamedValue[]>(api.get("/eda/churn_by_hours", { signal }));

export const churnByDeptSalary = (signal?: AbortSignal) =>
  dataOf<DeptSalaryRow[]>(
    api.get("/eda/churn_by_dept_salary", { signal })
  );

/* =============
 * Predict API
 * ============= */
export const predict = (payload: PredictRequest, signal?: AbortSignal) =>
  dataOf<PredictResponse>(api.post("/predict", payload, { signal }));
