import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

type Row = { name: string; [k: string]: number | string };

export default function GroupedBars({
  data, series = [
    { key: "low",    label: "Low",    color: "#60a5fa" },
    { key: "medium", label: "Medium", color: "#a78bfa" },
    { key: "high",   label: "High",   color: "#34d399" },
  ],
  height = 320,
}: {
  data: Row[];
  series?: { key: string; label: string; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 12, left: 24, bottom: 8 }}>
        <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: "rgba(255,255,255,.10)" }}
               tick={{ fill: "rgba(230,238,252,.85)" }} />
        <YAxis tickLine={false} axisLine={{ stroke: "rgba(255,255,255,.10)" }}
               tick={{ fill: "rgba(230,238,252,.75)" }} width={48} tickMargin={8} />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,.04)" }}
          contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12 }}
          labelStyle={{ color: "rgba(230,238,252,.85)" }}
          formatter={(v: any) => [`${Number(v).toFixed(1)}%`, "churn"]}
        />
        <Legend wrapperStyle={{ color: "rgba(230,238,252,.75)" }} />
        {series.map(s => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[8,8,0,0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
