// src/components/Topbar.tsx
export default function Topbar() {
  return (
    <header className="h-16 px-4 sm:px-6 md:px-8 flex items-center justify-between border-b border-white/10"
      style={{
        background:
          "linear-gradient(90deg, rgba(14,165,233,.25), rgba(139,92,246,.25))"
      }}
    >
      <div className="text-2xl md:text-3xl font-extrabold tracking-tight">
        Salifort HR · <span className="text-sky-300">Analytics</span>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <input
          placeholder="Buscar (ex.: department = sales)"
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400 w-64"
        />
      </div>
    </header>
  );
}
