import React, { useMemo, useState } from "react";

type Props = {
  columns: string[];
  rows: any[];
  total: number;
  pageSizeOptions?: number[];
};

function isNumeric(v: any) {
  if (v === null || v === undefined) return false;
  const n = Number(v);
  return Number.isFinite(n);
}

export default function DataTable({
  columns,
  rows,
  total,
  pageSizeOptions = [10, 20, 50, 100],
}: Props) {
  // detecta quais colunas são numéricas usando a 1ª linha disponível
  const numericCols = useMemo(() => {
    const first = rows[0] ?? {};
    const set = new Set<string>();
    columns.forEach((c) => {
      if (isNumeric(first[c])) set.add(c);
    });
    return set;
  }, [columns, rows]);

  // paginação
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setPage] = useState<number>(1);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  // helpers
  const fmt = (c: string, v: any) =>
    numericCols.has(c) && isNumeric(v) ? Number(v).toFixed(2) : String(v);

  return (
    <div className="card p-4 overflow-auto">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="section-title">
          Amostra do dataset ({pageRows.length} de {total})
        </div>
        <div className="flex items-center gap-2 text-[color:var(--muted)] text-xs">
          <span>Linhas por página</span>
          <select
            className="bg-transparent border border-white/10 rounded px-2 py-1 text-[color:var(--txt)]"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="min-w-[1000px]">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-[#0f172a]/85 backdrop-blur">
            <tr className="border-b border-white/10">
              {columns.map((c) => (
                <th
                  key={c}
                  className="text-left px-3 py-2 text-[color:var(--muted)] font-medium uppercase text-xs tracking-wide"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => (
              <tr
                key={i}
                className="odd:bg-white/0 even:bg-white/[.03] hover:bg-white/[.06] transition-colors"
              >
                {columns.map((c) => (
                  <td
                    key={c}
                    className={`px-3 py-2 border-b border-white/5 ${
                      numericCols.has(c) ? "text-right tabular-nums" : "text-left"
                    }`}
                  >
                    {fmt(c, r[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* paginação */}
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-[color:var(--muted)]">
        <span>
          Página <span className="text-[color:var(--txt)]">{page}</span> de{" "}
          <span className="text-[color:var(--txt)]">{pageCount}</span>
        </span>
        <button
          className="px-2 py-1 border border-white/10 rounded disabled:opacity-40"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          «
        </button>
        <button
          className="px-2 py-1 border border-white/10 rounded disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <button
          className="px-2 py-1 border border-white/10 rounded disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
        >
          Próxima
        </button>
        <button
          className="px-2 py-1 border border-white/10 rounded disabled:opacity-40"
          onClick={() => setPage(pageCount)}
          disabled={page === pageCount}
        >
          »
        </button>
      </div>
    </div>
  );
}
