import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Item = { name: string; value: number };

export default function BarChartSimple({ data, height = 260 }: { data: Item[]; height?: number }) {
  return (
    <div style={{ height, background: "#0b1220", borderRadius: 12, padding: 12 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
