import React from "react";

type Props = { title: string; value: string | number; subtitle?: string };

export default function KpiCard({ title, value, subtitle }: Props) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: "#101827", color: "#fff" }}>
      <div style={{ opacity: 0.8, fontSize: 12 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{value}</div>
      {subtitle && <div style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>{subtitle}</div>}
    </div>
  );
}
