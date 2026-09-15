import type {
  DatasetMetrics,
  DeptSalaryRow,
  NamedValue,
  PreviewResponse,
} from "../lib/api";

export const demoMetrics: DatasetMetrics = {
  count: 14_999,
  churn_rate: 0.2381,
  avg_hours: 201.1,
  avg_projects: 3.8,
  hours_by_left: { stayed: 199.1, left: 207.4 },
  projects_hist: { "2": 2388, "3": 4055, "4": 4365, "5": 2761, "6": 1174, "7": 256 },
  top_departments: { sales: 4140, technical: 2720, support: 2229, it: 1227, product_mng: 902 },
  salary_dist: { low: 7316, medium: 6446, high: 1237 },
};

export const demoPreview: PreviewResponse = {
  count: 14_999,
  columns: [
    "satisfaction_level",
    "last_evaluation",
    "number_project",
    "average_monthly_hours",
    "tenure",
    "department",
    "salary",
    "left",
  ],
  rows: [
    { satisfaction_level: .38, last_evaluation: .53, number_project: 2, average_monthly_hours: 157, tenure: 3, department: "sales", salary: "low", left: 1 },
    { satisfaction_level: .80, last_evaluation: .86, number_project: 5, average_monthly_hours: 262, tenure: 6, department: "sales", salary: "medium", left: 1 },
    { satisfaction_level: .11, last_evaluation: .88, number_project: 7, average_monthly_hours: 272, tenure: 4, department: "sales", salary: "medium", left: 1 },
    { satisfaction_level: .72, last_evaluation: .87, number_project: 5, average_monthly_hours: 223, tenure: 5, department: "sales", salary: "low", left: 1 },
    { satisfaction_level: .58, last_evaluation: .62, number_project: 3, average_monthly_hours: 177, tenure: 3, department: "technical", salary: "medium", left: 0 },
    { satisfaction_level: .84, last_evaluation: .74, number_project: 4, average_monthly_hours: 188, tenure: 2, department: "it", salary: "high", left: 0 },
  ],
};

export const demoSatisfactionDistribution: NamedValue[] = [
  { name: "0.0–0.1", value: 195 }, { name: "0.1–0.2", value: 1214 },
  { name: "0.2–0.3", value: 493 }, { name: "0.3–0.4", value: 1013 },
  { name: "0.4–0.5", value: 1668 }, { name: "0.5–0.6", value: 1953 },
  { name: "0.6–0.7", value: 1960 }, { name: "0.7–0.8", value: 2279 },
  { name: "0.8–0.9", value: 2220 }, { name: "0.9–1.0", value: 2004 },
];

export const demoChurnBySatisfaction: NamedValue[] = [
  { name: "0.0–0.1", value: 100 }, { name: "0.1–0.2", value: 59.7 },
  { name: "0.2–0.3", value: 5.1 }, { name: "0.3–0.4", value: 61.3 },
  { name: "0.4–0.5", value: 58.8 }, { name: "0.5–0.6", value: 2.5 },
  { name: "0.6–0.7", value: 1.6 }, { name: "0.7–0.8", value: 16.1 },
  { name: "0.8–0.9", value: 20.8 }, { name: "0.9–1.0", value: 5.7 },
];

export const demoChurnByProjects: NamedValue[] = [
  { name: "2", value: 65.6 }, { name: "3", value: 1.8 },
  { name: "4", value: 9.4 }, { name: "5", value: 22.2 },
  { name: "6", value: 55.8 }, { name: "7", value: 100 },
];

export const demoChurnByHours: NamedValue[] = [
  { name: "80–119", value: 0 }, { name: "120–159", value: 40.1 },
  { name: "160–199", value: 3.9 }, { name: "200–239", value: 11.7 },
  { name: "240–279", value: 29 }, { name: "280–319", value: 78.2 },
];

export const demoTopDepartments: NamedValue[] = [
  { name: "Vendas", value: 1014 }, { name: "Técnico", value: 697 },
  { name: "Suporte", value: 555 }, { name: "TI", value: 273 },
  { name: "RH", value: 215 }, { name: "Contabilidade", value: 204 },
];

export const demoDeptSalary: DeptSalaryRow[] = [
  { name: "Vendas", low: 33.2, medium: 17.1, high: 5.2 },
  { name: "Técnico", low: 27.6, medium: 25.6, high: 12.4 },
  { name: "Suporte", low: 33.9, medium: 16.8, high: 5.7 },
  { name: "TI", low: 28.2, medium: 18.1, high: 4.8 },
  { name: "Produto", low: 23.3, medium: 22.7, high: 8.8 },
  { name: "Marketing", low: 31.3, medium: 18.1, high: 11.2 },
];

export const demoRisk = (input: {
  satisfaction_level: number;
  number_project: number;
  average_monthly_hours: number;
  tenure: number;
  promotion_last_5years: number;
  salary: string;
}) => {
  let score = .08;
  if (input.satisfaction_level < .2) score += .42;
  else if (input.satisfaction_level < .5) score += .27;
  else if (input.satisfaction_level > .72 && input.average_monthly_hours > 235) score += .12;
  if (input.number_project <= 2) score += .22;
  if (input.number_project >= 6) score += .28;
  if (input.average_monthly_hours < 150) score += .12;
  if (input.average_monthly_hours > 240) score += .18;
  if (input.average_monthly_hours > 280) score += .15;
  if (input.tenure >= 4 && input.tenure <= 6) score += .08;
  if (!input.promotion_last_5years) score += .05;
  if (input.salary === "low") score += .12;
  if (input.salary === "high") score -= .08;
  return Math.max(.02, Math.min(.96, score));
};
