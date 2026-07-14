import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface PlantelScreenProps {
  totalAvesActivas: string;
  setTotalAvesActivas: (val: string) => void;
  cargarDatos: () => void;
}

export default function PlantelScreen({ totalAvesActivas, setTotalAvesActivas, cargarDatos }: PlantelScreenProps) {
  const [fechaMovimiento, setFechaMovimiento] = useState(new Date().toISOString().split('T')[0]);
  const [tipoMovimiento, setTipoMovimiento] = useState<'Compra' | 'Venta' | 'Muerto' | 'Ajuste'>('Muerto');
  const [subTipoAjuste, setSubTipoAjuste] = useState<'suma' | 'resta'>('resta'); // Para controlar la dirección del ajuste
  const [cantAves, setCantAves] = useState<string>('0');
  const [motivoPlantel, setMotivoPlantel] = useState('');

  const handleGuardarMovimientoPlantel = async () => {
    const cant = parseInt(cantAves) || 0;
    if (cant <= 0) {
      alert("Por favor ingresa una cantidad de aves válida.");
      return;
    }

    // Si es un ajuste de resta, le concatenamos un texto claro al detalle para que el backend lo procese restando
    let detalleFinal = motivoPlantel.trim();
    if (tipoMovimiento === 'Ajuste') {
      detalleFinal = subTipoAjuste === 'resta' ? `[Resta/Baja] - ${detalleFinal}` : `[Suma/Alta] - ${detalleFinal}`;
    }

    try {
      const { error } = await supabase.from('gallinero').insert([
        {
          fecha: fechaMovimiento,
          movimiento: tipoMovimiento,
          cantidad: cant,
          detalle: detalleFinal,
        },
      ]);
      if (error) throw error;

      alert("¡Registro de movimiento guardado!");
      setCantAves('0');
      setMotivoPlantel('');
      cargarDatos();
    } catch (err: any) {
      alert(`Falla de Guardado: ${err.message}`);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <p className="text-[12px] text-[#444651] uppercase tracking-wider font-semibold">Población de Aves</p>
        <h2 className="text-[24px] font-bold text-[#191c1d]">Gestión del Plantel</h2>
        <p className="text-xs text-gray-500">Registra movimientos y mermas en el gallinero.</p>
      </div>

      <div className="bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-sm space-y-2">
        <label className="block text-xs font-bold text-gray-500 uppercase">Cantidad de Gallinas Activas en Plantel</label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            className="flex-1 border border-gray-200 bg-gray-50 rounded-lg p-2 text-lg font-bold text-[#00236f]"
            value={parseInt(totalAvesActivas).toLocaleString('es-CL')}
          />
          <div className="bg-[#00236f]/10 px-3 py-2 rounded-lg flex items-center text-sm font-semibold text-[#00236f]">
            Aves en Total
          </div>
        </div>
        <p className="text-xs text-gray-400 italic">Calculado automáticamente desde el historial.</p>
      </div>

      <div className="bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-[#444651] border-b pb-2">Registrar Transacción / Muerte</h3>

        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-500">Fecha del Evento</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg p-2.5"
            value={fechaMovimiento}
            onChange={(e) => setFechaMovimiento(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-500">Tipo de Movimiento</label>
          <div className="grid grid-cols-4 gap-1 bg-gray-100 p-1 rounded-lg">
            {(['Compra', 'Venta', 'Muerto', 'Ajuste'] as const).map((mov) => (
              <button
                key={mov}
                type="button"
                onClick={() => setTipoMovimiento(mov)}
                className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                  tipoMovimiento === mov ? 'bg-white shadow text-[#00236f]' : 'text-gray-500'
                }`}
              >
                {mov}
              </button>
            ))}
          </div>
        </div>

        {/* SELECTOR ADICIONAL DE DIRECCIÓN DEL AJUSTE */}
        {tipoMovimiento === 'Ajuste' && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg space-y-2">
            <label className="block text-xs font-bold text-amber-900 uppercase">Sentido del Ajuste</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSubTipoAjuste('suma')}
                className={`py-1 text-xs font-semibold rounded ${subTipoAjuste === 'suma' ? 'bg-[#006c49] text-white' : 'bg-white text-gray-600 border'}`}
              >
                Suma Gallinas (Alta)
              </button>
              <button
                type="button"
                onClick={() => setSubTipoAjuste('resta')}
                className={`py-1 text-xs font-semibold rounded ${subTipoAjuste === 'resta' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border'}`}
              >
                Resta Gallinas (Baja)
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1 text-[#444651]">Cantidad de Aves</label>
          <input
            type="text"
            pattern="[0-9]*"
            className="w-full border border-gray-300 rounded-lg p-2 text-center text-lg font-bold"
            placeholder="0"
            value={cantAves}
            onChange={(e) => setCantAves(e.target.value.replace(/[^0-9]/g, ''))}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-[#444651]">Motivo / Detalle</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
            placeholder="Ej: Conteo de inventario, error de digitación..."
            value={motivoPlantel}
            onChange={(e) => setMotivoPlantel(e.target.value)}
          />
        </div>

        <button
          onClick={handleGuardarMovimientoPlantel}
          className="w-full h-12 bg-[#00236f] text-white font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Guardar Registro
        </button>
      </div>
    </section>
  );
}
