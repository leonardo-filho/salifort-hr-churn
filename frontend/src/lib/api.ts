import axios from "axios";

// pega do .env do Vite ou usa o fallback local
const baseURL =
  (import.meta as any).env?.VITE_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

// helpers usados no Dashboard
export const getMetrics = async () => {
  const { data } = await api.get("/dataset/metrics");
  return data;
};

export const getPreview = async (n = 20) => {
  const { data } = await api.get("/dataset/preview", { params: { n } });
  return data;
};
