interface MetricasScreenProps {
  tasaPostura: number;
  totalAvesActivas: number;
  ventasMes: number;
  promedioVenta: number;
  alimentoHoy: number;
  rankingHuevos: { categoria: string; cantidad: number }[];
  produccionHoy: {
    super: number;
    extra: number;
    primera: number;
    segunda: number;
    merma: number;
    totalNeto: number;
  };
  cargarDatos: () => void;
}

export default function MetricasScreen({
  tasaPostura,
  totalAvesActivas,
  ventasMes,
  promedioVenta,
  alimentoHoy,
  rankingHuevos,
  produccionHoy,
  cargarDatos,
}: MetricasScreenProps) {
  
  const gramosPorAve = totalAvesActivas > 0 ? Math.round((alimentoHoy * 1000) / totalAvesActivas) : 0;

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[12px] text-[#444651] uppercase tracking-wider font-semibold">Dashboard de Operaciones</p>
          <h2 className="text-[24px] font-bold text-[#191c1d]">Métricas en Tiempo Real</h2>
        </div>
        <button
          onClick={cargarDatos}
          className="w-12 h-12 flex items-center justify-center bg-[#e7e8e9] rounded-lg active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[#444651]">refresh</span>
        </button>
      </div>

      {/* BLOQUE 1: OPERACIONES VIVAS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#00236f]"></div>
          <span className="text-xs font-semibold text-gray-500 block mb-1">Plantel Vivo</span>
          <span className="text-[28px] font-bold text-[#00236f]">{totalAvesActivas.toLocaleString('es-CL')}</span>
          <p className="text-[11px] text-gray-400 mt-1">Aves activas en galpón</p>
        </div>

        <div className="bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#006c49]"></div>
          <span className="text-xs font-semibold text-gray-500 block mb-1">Tasa de Postura</span>
          <span className="text-[28px] font-bold text-[#006c49]">{tasaPostura}%</span>
          <div className="mt-2 h-1 w-full bg-gray-100 rounded-full">
            <div className="h-full bg-[#006c49] rounded-full" style={{ width: `${tasaPostura}%` }}></div>
          </div>
        </div>
      </div>

      {/* NUEVO BLOQUE: RECOLECCIÓN DE HOY DESGLOSADA POR CATEGORÍA */}
      <div className="bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-sm font-bold text-[#444651] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#00236f]">egg_alt</span>
            Recolección de Hoy por Categoría
          </h3>
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
            Neto: {produccionHoy.totalNeto} ud
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Súper */}
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-lg p-2 text-center">
            <span className="text-[10px] font-bold text-amber-800 block uppercase tracking-wider">Súper</span>
            <span className="text-lg font-extrabold text-[#191c1d]">{produccionHoy.super}</span>
            <span className="text-[9px] text-gray-400 block mt-0.5">huevos</span>
          </div>

          {/* Extra */}
          <div className="bg-blue-50/50 border border-blue-200/60 rounded-lg p-2 text-center">
            <span className="text-[10px] font-bold text-blue-800 block uppercase tracking-wider">Extra</span>
            <span className="text-lg font-extrabold text-[#191c1d]">{produccionHoy.extra}</span>
            <span className="text-[9px] text-gray-400 block mt-0.5">huevos</span>
          </div>

          {/* Primera */}
          <div className="bg-indigo-50/50 border border-indigo-200/60 rounded-lg p-2 text-center">
            <span className="text-[10px] font-bold text-indigo-800 block uppercase tracking-wider">Primera</span>
            <span className="text-lg font-extrabold text-[#191c1d]">{produccionHoy.primera}</span>
            <span className="text-[9px] text-gray-400 block mt-0.5">huevos</span>
          </div>

          {/* Segunda */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <span className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Segunda</span>
            <span className="text-lg font-extrabold text-[#191c1d]">{produccionHoy.segunda}</span>
            <span className="text-[9px] text-gray-400 block mt-0.5">huevos</span>
          </div>
        </div>

        {/* Alerta de Merma */}
        {produccionHoy.merma > 0 && (
          <div className="flex justify-between items-center bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 text-xs text-red-700 mt-1">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-sm">dangerous</span>
              Mermas/Rotas registradas hoy:
            </span>
            <span className="font-extrabold">{produccionHoy.merma} unidades</span>
          </div>
        )}
      </div>

      {/* BLOQUE 2: COMERCIAL */}
      <div className="bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#444651] uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-xs">payments</span> Resumen de Ingresos
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs text-gray-400 block">Ventas del Mes</span>
            <span className="text-xl font-bold text-gray-800">${ventasMes.toLocaleString('es-CL')}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Ticket Promedio</span>
            <span className="text-xl font-bold text-[#00236f]">${promedioVenta.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </div>

      {/* BLOQUE 3: CONSUMOS DIARIOS */}
      <div className="bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-[#444651] uppercase tracking-wider border-b pb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-xs">nutrition</span> Alimentación
        </h3>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-400 block">Ración Diaria Total</span>
            <span className="text-xl font-bold text-gray-800">{alimentoHoy} Kg</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block">Consumo Promedio</span>
            <span className={`text-lg font-bold ${gramosPorAve > 125 || gramosPorAve < 110 ? 'text-amber-600' : 'text-emerald-700'}`}>
              {gramosPorAve}g <span className="text-xs font-normal text-gray-500">/ ave</span>
            </span>
          </div>
        </div>
      </div>

      {/* BLOQUE 4: RANKING */}
      <div className="bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-[#444651] uppercase tracking-wider border-b pb-1">
          Ranking de Movimiento de Huevos (Formatos en Mes)
        </h3>
        {rankingHuevos.length > 0 ? (
          <div className="space-y-2.5 pt-1">
            {rankingHuevos.map((item, index) => {
              const maxCantidad = rankingHuevos[0]?.cantidad || 1;
              const porcentajeBarra = Math.round((item.cantidad / maxCantidad) * 100);
              return (
                <div key={item.categoria} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-gray-700">
                    <span>{index + 1}. Huevo {item.categoria}</span>
                    <span className="font-bold text-gray-900">{item.cantidad} fts.</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00236f] rounded-full transition-all duration-500" 
                      style={{ width: `${porcentajeBarra}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic text-center py-2">No registras ventas ingresadas este mes aún.</p>
        )}
      </div>
    </section>
  );
}