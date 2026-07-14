import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface ProduccionScreenProps {
  onSuccess: () => void;
}

export default function ProduccionScreen({ onSuccess }: ProduccionScreenProps) {
  const [fechaProduccion, setFechaProduccion] = useState(new Date().toISOString().split('T')[0]);
  const [cantSuper, setCantSuper] = useState<string>('0');
  const [cantExtra, setCantExtra] = useState<string>('0');
  const [cantPrimera, setCantPrimera] = useState<string>('0');
  const [cantSegunda, setCantSegunda] = useState<string>('0');
  const [cantMerma, setCantMerma] = useState<string>('0');
  const [alimentoKg, setAlimentoKg] = useState<string>('0');
  const [obsProduccion, setObsProduccion] = useState('');

  // --- LÓGICA MATEMÁTICA CON RESTA DE MERMA ---
  const s = parseInt(cantSuper) || 0;
  const e = parseInt(cantExtra) || 0;
  const p = parseInt(cantPrimera) || 0;
  const seg = parseInt(cantSegunda) || 0;
  const m = parseInt(cantMerma) || 0;
  
  // Suma de categorías menos los huevos rotos
  const totalHuevosComerciales = Math.max(0, (s + e + p + seg) - m);
// aqui
const handleGuardarProduccion = async () => {
    if (s === 0 && e === 0 && p === 0 && seg === 0 && m === 0 && parseFloat(alimentoKg) <= 0) {
      alert("Debes registrar cantidades de huevos o consumo de alimento.");
      return;
    }

    try {
      const { error } = await supabase.from('produccion').insert([
        {
          fecha: fechaProduccion,
          total_huevos_recolectados: totalHuevosComerciales, // Guarda el NETO
          super: s,
          extra: e,
          primera: p,
          segunda: seg,
          merma: m,
          alimento_kg: parseFloat(alimentoKg) || 0,
          observaciones: obsProduccion.trim(),
        },
      ]);

      if (error) throw error;

      alert(`¡Recolección guardada con éxito! Neto de esta tanda: ${totalHuevosComerciales} huevos.`);
      setCantSuper('0');
      setCantExtra('0');
      setCantPrimera('0');
      setCantSegunda('0');
      setCantMerma('0');
      setAlimentoKg('0');
      setObsProduccion('');
      onSuccess();
    } catch (err: any) {
      alert(`Falla de Guardado: ${err.message}`);
    }
  };
//aqui
  return (
    <section className="space-y-4">
      <div>
        <p className="text-[12px] text-[#444651] uppercase tracking-wider font-semibold">Ingreso de Recolección</p>
        <h2 className="text-[24px] font-bold text-[#191c1d]">Producción Diaria</h2>
        <p className="text-xs text-gray-500">Registra el control de producción y alimento.</p>
      </div>

      <div className="bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#444651]">Fecha de Recolección</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg p-2.5"
            value={fechaProduccion}
            onChange={(e) => setFechaProduccion(e.target.value)}
          />
        </div>

        {/* Categorías Desglosadas */}
        <div className="space-y-3 pt-2 border-t">
          <h3 className="text-xs font-bold text-gray-400 uppercase">Cantidad por Categoría (Unidades)</h3>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-[#444651] w-24">Súper:</span>
            <input
              type="text" pattern="[0-9]*"
              className="border border-gray-300 rounded-lg p-2 text-center w-24 font-bold"
              value={cantSuper}
              onChange={(e) => setCantSuper(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-[#444651] w-24">Extra:</span>
            <input
              type="text" pattern="[0-9]*"
              className="border border-gray-300 rounded-lg p-2 text-center w-24 font-bold"
              value={cantExtra}
              onChange={(e) => setCantExtra(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-[#444651] w-24">Primera:</span>
            <input
              type="text" pattern="[0-9]*"
              className="border border-gray-300 rounded-lg p-2 text-center w-24 font-bold"
              value={cantPrimera}
              onChange={(e) => setCantPrimera(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-[#444651] w-24">Segunda:</span>
            <input
              type="text" pattern="[0-9]*"
              className="border border-gray-300 rounded-lg p-2 text-center w-24 font-bold"
              value={cantSegunda}
              onChange={(e) => setCantSegunda(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>

          <div className="flex items-center justify-between gap-4 text-red-600">
            <span className="text-sm font-semibold w-24">Merma / Rotas:</span>
            <input
              type="text" pattern="[0-9]*"
              className="border border-red-300 rounded-lg p-2 text-center w-24 font-bold text-red-600 bg-red-50"
              value={cantMerma}
              onChange={(e) => setCantMerma(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
        </div>

        {/* Tarjeta de Total Neto con la Resta Aplicada */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex justify-between items-center text-emerald-900">
          <span className="text-sm font-semibold">Total Comercializable (Neto):</span>
          <span className="text-xl font-bold">{totalHuevosComerciales} huevos</span>
        </div>

        {/* Alimento */}
        <div className="pt-2 border-t space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase">Insumos del Gallinero</h3>
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#444651]">Alimento Consumido (Kg)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2.5 font-semibold text-center text-lg"
              placeholder="0.0"
              value={alimentoKg}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                  setAlimentoKg(val);
                }
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-[#444651]">Observaciones Especiales</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            rows={2}
            placeholder="Alguna novedad adicional..."
            value={obsProduccion}
            onChange={(e) => setObsProduccion(e.target.value)}
          />
        </div>

        <button
          onClick={handleGuardarProduccion}
          className="w-full h-12 bg-[#006c49] text-white font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">save</span>
          Guardar Registro Diario
        </button>
      </div>
    </section>
  );
}