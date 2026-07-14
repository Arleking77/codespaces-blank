interface BottomNavProps {
  activeTab: 'ventas' | 'produccion' | 'plantel' | 'metricas';
  setActiveTab: (tab: 'ventas' | 'produccion' | 'plantel' | 'metricas') => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 flex justify-around max-w-xl mx-auto py-2">
      {/* PESTAÑA: MÈTRICAS */}
      <button
        onClick={() => setActiveTab('metricas')}
        className={`flex flex-col items-center flex-1 ${activeTab === 'metricas' ? 'text-[#00236f]' : 'text-gray-400'}`}
      >
        <span className="material-symbols-outlined">analytics</span>
        <span className="text-[10px] font-semibold mt-0.5">Métricas</span>
      </button>

      {/* PESTAÑA: PRODUCCIÓN */}
      <button
        onClick={() => setActiveTab('produccion')}
        className={`flex flex-col items-center flex-1 ${activeTab === 'produccion' ? 'text-[#00236f]' : 'text-gray-400'}`}
      >
        <span className="material-symbols-outlined">egg</span>
        <span className="text-[10px] font-semibold mt-0.5">Producción</span>
      </button>

      {/* PESTAÑA: DESPACHO (VENTAS) */}
      <button
        onClick={() => setActiveTab('ventas')}
        className={`flex flex-col items-center flex-1 ${activeTab === 'ventas' ? 'text-[#00236f]' : 'text-gray-400'}`}
      >
        <span className="material-symbols-outlined">local_shipping</span>
        <span className="text-[10px] font-semibold mt-0.5">Despacho</span>
      </button>

      {/* PESTAÑA: PLANTEL */}
      <button
        onClick={() => setActiveTab('plantel')}
        className={`flex flex-col items-center flex-1 ${activeTab === 'plantel' ? 'text-[#00236f]' : 'text-gray-400'}`}
      >
        <span className="material-symbols-outlined">house_siding</span>
        <span className="text-[10px] font-semibold mt-0.5">Plantel</span>
      </button>
    </nav>
  );
}