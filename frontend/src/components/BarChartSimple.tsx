import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

type Item = { name: string; value: number };

export default function BarChartSimple({
  data,
  color = "#60a5fa",
  height = 280,
  yLabel,
  rounded = 10,
}: {
  data: Item[];
  color?: string;
  height?: number;
  yLabel?: string;
  rounded?: number;
}) {
  const gid = `g-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          // mais espaço à esquerda p/ acomodar ticks + label
          margin={{ top: 10, right: 18, left: 56, bottom: 8 }}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.95} />
              <stop offset="100%" stopColor={color} stopOpacity={0.35} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />

          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,.10)" }}
            tick={{ fill: "rgba(230,238,252,.85)" }}
            minTickGap={6}
          />

          <YAxis
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,.10)" }}
            tick={{ fill: "rgba(230,238,252,.75)" }}
            tickMargin={10}     // separa número do eixo
            width={72}          // reserva espaço total p/ ticks + label
            label={
              yLabel
                ? {
                    value: yLabel,
                    angle: -90,
                    position: "left",           // fora do eixo (minúsculo)
                    offset: 28,                 // distância do eixo
                    style: { fill: "rgba(230,238,252,.6)" },
                  }
                : undefined
            }
          />

          <Tooltip
            cursor={{ fill: "rgba(255,255,255,.04)" }}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 12,
              color: "white",
            }}
            labelStyle={{ color: "rgba(230,238,252,.75)" }}
            formatter={(v: any) => [v, "valor"]}
          />

          <ReferenceLine y={0} stroke="rgba(255,255,255,.18)" />

          <Bar
            dataKey="value"
            fill={`url(#${gid})`}
            radius={[rounded, rounded, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
