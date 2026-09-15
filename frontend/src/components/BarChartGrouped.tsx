import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DeptSalaryRow } from "../lib/api";

export default function BarChartGrouped({ data }: { data: DeptSalaryRow[] }) {
  return (
    <div className="chart-wrap" role="img" aria-label="Taxa de saída por departamento e faixa salarial">
      <ResponsiveContainer width="100%" height={330}>
        <BarChart data={data} margin={{ top: 12, right: 8, left: -14, bottom: 16 }}>
          <CartesianGrid stroke="rgba(242,239,230,.09)" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#898981", fontSize: 10 }} interval={0} angle={-20} textAnchor="end" />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#74746d", fontSize: 10 }} unit="%" />
          <Tooltip
            cursor={{ fill: "rgba(216,255,52,.04)" }}
            contentStyle={{ background: "#171714", border: "1px solid rgba(242,239,230,.16)", borderRadius: 0 }}
            formatter={(value, name) => [`${Number(value).toFixed(1)}%`, String(name)]}
          />
          <Legend iconType="plainline" wrapperStyle={{ fontSize: 11, color: "#a8a89f" }} />
          <Bar dataKey="low" name="Salário baixo" fill="#ff7657" radius={[2, 2, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="medium" name="Salário médio" fill="#d8ff34" radius={[2, 2, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="high" name="Salário alto" fill="#7d8b82" radius={[2, 2, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
