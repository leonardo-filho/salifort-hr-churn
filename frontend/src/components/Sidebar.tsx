// src/components/Sidebar.tsx
const LinkItem = ({ children }: { children: React.ReactNode }) => (
  <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/5 text-[color:var(--muted)] hover:text-white transition">
    {children}
  </button>
);

// src/components/Sidebar.tsx
export default function Sidebar() {
  return (
    <div className="w-60 h-screen bg-[#0f172a] flex flex-col p-4 border-r border-white/10">
      <h2 className="text-xl font-bold mb-8">Salifort HR</h2>
      <nav className="flex flex-col gap-4">
        <a href="#" className="hover:text-cyan-400">Dashboard</a>
        <a href="#" className="hover:text-cyan-400">Dataset</a>
        <a href="#" className="hover:text-cyan-400">Modelos</a>
        <a href="#" className="hover:text-cyan-400">Previsões</a>
      </nav>
    </div>
  );
}

