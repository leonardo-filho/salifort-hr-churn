import { useMemo, useState } from "react";

type Cell = string | number | null;
type Props = { columns: string[]; rows: Record<string, Cell>[]; total: number };

const labels: Record<string, string> = {
  satisfaction_level: "Satisfação",
  last_evaluation: "Avaliação",
  number_project: "Projetos",
  average_monthly_hours: "Horas/mês",
  tenure: "Anos",
  department: "Departamento",
  salary: "Salário",
  left: "Saiu",
};

const display = (column: string, value: Cell) => {
  if (column === "left") return Number(value) === 1 ? "Sim" : "Não";
  if (column === "salary") return ({ low: "Baixo", medium: "Médio", high: "Alto" }[String(value)] ?? value);
  if (["satisfaction_level", "last_evaluation"].includes(column)) return Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  return String(value ?? "—");
};

export default function DataTable({ columns, rows, total }: Props) {
  const visibleColumns = useMemo(() => columns.filter((column) => labels[column]), [columns]);
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="data-table-shell">
      <div className="table-meta"><span>Amostra do conjunto</span><span>{total.toLocaleString("pt-BR")} registros no total</span></div>
      <div className="table-scroll" tabIndex={0} aria-label="Tabela rolável horizontalmente">
        <table>
          <thead><tr>{visibleColumns.map((column) => <th key={column} scope="col">{labels[column]}</th>)}</tr></thead>
          <tbody>
            {pageRows.map((row, index) => (
              <tr key={`${page}-${index}`}>
                {visibleColumns.map((column) => <td key={column} className={column === "left" ? `status-cell status-${row[column]}` : ""}>{display(column, row[column])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && <div className="table-pagination">
        <button type="button" onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0}>Anterior</button>
        <span>{page + 1} / {pages}</span>
        <button type="button" onClick={() => setPage((value) => Math.min(pages - 1, value + 1))} disabled={page === pages - 1}>Próxima</button>
      </div>}
    </div>
  );
}
