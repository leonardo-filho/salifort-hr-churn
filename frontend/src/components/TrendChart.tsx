import { useId } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { NamedValue } from "../lib/api";

export default function TrendChart({
  data,
  ariaLabel,
  suffix = "%",
  color = "#ff7657",
}: {
  data: NamedValue[];
  ariaLabel: string;
  suffix?: string;
  color?: string;
}) {
  const rawId = useId();
  const id = `area-${rawId.replace(/:/g, "")}`;
  return (
    <div className="chart-wrap" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={290}>
        <AreaChart data={data} margin={{ top: 20, right: 10, left: -18, bottom: 4 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity=".34" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(242,239,230,.09)" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} interval="preserveStartEnd" tick={{ fill: "#898981", fontSize: 10 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#74746d", fontSize: 10 }} unit={suffix} />
          <Tooltip
            contentStyle={{ background: "#171714", border: "1px solid rgba(242,239,230,.16)", borderRadius: 0 }}
            formatter={(value) => [`${Number(value).toFixed(1)}${suffix}`, "Taxa"]}
          />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${id})`} activeDot={{ r: 5, stroke: "#11110f", strokeWidth: 2 }} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
