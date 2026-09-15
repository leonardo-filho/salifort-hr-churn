import type { IconType } from "react-icons";

type Props = {
  label: string;
  value: string;
  detail: string;
  icon: IconType;
  tone?: "acid" | "risk" | "neutral";
};

export default function KpiCard({ label, value, detail, icon: Icon, tone = "neutral" }: Props) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <div className="metric-head"><span>{label}</span><Icon aria-hidden="true" /></div>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}
