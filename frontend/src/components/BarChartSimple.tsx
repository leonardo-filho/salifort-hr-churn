import { useId } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { NamedValue } from "../lib/api";

type Props = {
  data: NamedValue[];
  color?: string;
  height?: number;
  suffix?: string;
  horizontal?: boolean;
  highlightMax?: boolean;
  ariaLabel: string;
};

export default function BarChartSimple({
  data,
  color = "#d8ff34",
  height = 280,
  suffix = "",
  horizontal = false,
  highlightMax = true,
  ariaLabel,
}: Props) {
  const rawId = useId();
  const gradientId = `bar-${rawId.replace(/:/g, "")}`;
  const max = Math.max(...data.map((item) => Number(item.value)));

  return (
    <div className="chart-wrap" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={horizontal ? { top: 8, right: 45, left: 12, bottom: 4 } : { top: 22, right: 8, left: -18, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2={horizontal ? "1" : "0"} y2={horizontal ? "0" : "1"}>
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity=".42" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(242,239,230,.09)" vertical={!horizontal} horizontal={horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={82} axisLine={false} tickLine={false} tick={{ fill: "#a8a89f", fontSize: 11 }} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" axisLine={false} tickLine={false} interval="preserveStartEnd" tick={{ fill: "#898981", fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#74746d", fontSize: 10 }} />
            </>
          )}
          <Tooltip
            cursor={{ fill: "rgba(216,255,52,.05)" }}
            contentStyle={{ background: "#171714", border: "1px solid rgba(242,239,230,.16)", borderRadius: 0, color: "#f2efe6" }}
            labelStyle={{ color: "#a8a89f", marginBottom: 4 }}
            formatter={(value) => [`${Number(value).toLocaleString("pt-BR")}${suffix}`, "Valor"]}
          />
          <Bar dataKey="value" fill={`url(#${gradientId})`} radius={horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0]} maxBarSize={horizontal ? 28 : 42} isAnimationActive={false}>
            {data.map((item) => <Cell key={item.name} fill={highlightMax && item.value === max ? "#ff7657" : `url(#${gradientId})`} />)}
            {horizontal && <LabelList dataKey="value" position="right" fill="#f2efe6" fontSize={11} formatter={(value: unknown) => `${Number(value).toLocaleString("pt-BR")}${suffix}`} />}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
