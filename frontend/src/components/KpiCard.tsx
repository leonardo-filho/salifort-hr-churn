import React from "react";

type Props = { 
  title: string; 
  value: string | number; 
  subtitle?: string 
};

export default function KpiCard({ title, value, subtitle }: Props) {
  return (
    <div
      className="
        rounded-2xl 
        p-4 md:p-6 
        bg-gradient-to-br from-[#151d31] to-[#0f172a]
        border border-white/5
        shadow-lg shadow-black/20
        transition-transform 
        hover:scale-[1.02] hover:shadow-xl
      "
    >
      {/* título */}
      <div className="text-sm text-[color:var(--muted)] uppercase tracking-wide">
        {title}
      </div>

      {/* valor principal */}
      <div className="text-3xl md:text-4xl font-bold text-white mt-2">
        {value}
      </div>

      {/* subtítulo (opcional) */}
      {subtitle && (
        <div className="text-xs text-[color:var(--muted)] mt-2">
          {subtitle}
        </div>
      )}
    </div>
  );
}
