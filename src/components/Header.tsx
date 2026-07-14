export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00236f] text-2xl font-bold">egg</span>
          <div>
            <h1 className="text-base font-extrabold text-[#191c1d] tracking-tight leading-none">Huevos HLE</h1>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Control Operacional</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-gray-500">Servidor Online</span>
        </div>
      </div>
    </header>
  );
}