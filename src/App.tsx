import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { ShoppingCart, Egg, Users, BarChart3, Plus, ShieldCheck } from 'lucide-react';

interface Cliente {
  id: number;
  nombre: string;
}

interface Precio {
  llave_combinada: string;
  precio_venta: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'ventas' | 'produccion' | 'plantel' | 'dashboard'>('ventas');
  
  // Estados para el formulario de Ventas
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [precios, setPrecios] = useState<Precio[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [precioAplicado, setPrecioAplicado] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Cargar clientes y precios desde Supabase al iniciar
  useEffect(() => {
    async function fetchData() {
      const { data: dataClientes, error: errorClientes } = await supabase
        .from('clientes')
        .select('id, nombre')
        .order('nombre');
        
      const { data: dataPrecios, error: errorPrecios } = await supabase
        .from('precios')
        .select('llave_combinada, precio_venta');
      
      if (errorClientes) console.error("Error cargando clientes:", errorClientes);
      if (errorPrecios) console.error("Error cargando precios:", errorPrecios);

      if (dataClientes) setClientes(dataClientes);
      if (dataPrecios) setPrecios(dataPrecios);
    }
    fetchData();
  }, []);

  // Actualizar el precio automático cuando cambia el formato seleccionado
  useEffect(() => {
    const formatoEncontrado = precios.find(p => p.llave_combinada === selectedFormat);
    if (formatoEncontrado) {
      setPrecioAplicado(formatoEncontrado.precio_venta);
    } else {
      setPrecioAplicado(0);
    }
  }, [selectedFormat, precios]);

  // Enviar la venta a Supabase
  const handleGuardarVenta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente || !selectedFormat || cantidad <= 0) return;

    setLoading(true);
    const montoTotal = cantidad * precioAplicado;

    const { error } = await supabase.from('ventas').insert([
      {
        cliente_id: parseInt(selectedCliente),
        llave_precio: selectedFormat,
        unidades_formato: cantidad,
        precio_unitario_aplicado: precioAplicado,
        monto_total: montoTotal,
        fecha: new Date().toISOString().split('T')[0]
      }
    ]);

    setLoading(false);
    if (!error) {
      setSuccessMessage('¡Venta registrada con éxito en ruta!');
      setCantidad(1);
      setSelectedFormat('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      alert('Error al guardar la venta: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-xl border-x border-slate-200">
      {/* Encabezado fijo de la App */}
      <header className="bg-amber-600 text-white px-4 py-3 sticky top-0 z-10 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Egg className="w-6 h-6 animate-pulse" />
          <h1 className="font-bold text-lg tracking-wide">Control Avícola</h1>
        </div>
        <span className="text-xs bg-amber-700 px-2 py-1 rounded-full font-medium text-amber-100 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Supabase Activo
        </span>
      </header>

      {/* Contenedor Dinámico con Scroll */}
      <main className="flex-1 p-4 overflow-y-auto pb-24">
        {activeTab === 'ventas' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-600" /> Registrar Nueva Venta
              </h2>
              <p className="text-xs text-slate-500 mb-4">Ingreso rápido para furgón de reparto.</p>

              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-sm mb-4 font-medium">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleGuardarVenta} className="space-y-4">
                {/* Selector de Cliente */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Cliente</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={selectedCliente}
                    onChange={(e) => setSelectedCliente(e.target.value)}
                    required
                  >
                    <option value="">Selecciona un cliente...</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Selector de Formato / Producto */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Formato de Huevo</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    required
                  >
                    <option value="">Selecciona formato...</option>
                    {precios.map(p => (
                      <option key={p.llave_combinada} value={p.llave_combinada}>{p.llave_combinada}</option>
                    ))}
                  </select>
                </div>

                {/* Cantidad y Precio Dinámico */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      value={cantidad}
                      onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Precio Unitario</label>
                    <div className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-700">
                      ${precioAplicado.toLocaleString('es-CL')}
                    </div>
                  </div>
                </div>

                {/* Total Visual Automático */}
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex justify-between items-center mt-2">
                  <span className="text-xs font-bold text-amber-800">Total a Cobrar:</span>
                  <span className="text-lg font-black text-amber-700">
                    ${(cantidad * precioAplicado).toLocaleString('es-CL')}
                  </span>
                </div>

                {/* Botón de Envío */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-slate-300"
                >
                  <Plus className="w-4 h-4" /> {loading ? 'Guardando...' : 'Confirmar Venta'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'produccion' && (
          <div className="text-center py-8 text-slate-400 text-sm">Módulo de Producción Diaria (Próximo paso)</div>
        )}
        {activeTab === 'plantel' && (
          <div className="text-center py-8 text-slate-400 text-sm">Módulo de Gallinero y Bajas (Próximo paso)</div>
        )}
        {activeTab === 'dashboard' && (
          <div className="text-center py-8 text-slate-400 text-sm">Dashboard y Tasa de Postura (Próximo paso)</div>
        )}
      </main>

      {/* Barra de Navegación Inferior (Estilo Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 h-16 flex items-center justify-around z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setActiveTab('ventas')}
          className={`flex flex-col items-center gap-1 text-xs font-medium w-16 transition-colors ${activeTab === 'ventas' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ShoppingCart className="w-5 h-5" />
          Ventas
        </button>
        <button
          onClick={() => setActiveTab('produccion')}
          className={`flex flex-col items-center gap-1 text-xs font-medium w-16 transition-colors ${activeTab === 'produccion' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Egg className="w-5 h-5" />
          Producción
        </button>
        <button
          onClick={() => setActiveTab('plantel')}
          className={`flex flex-col items-center gap-1 text-xs font-medium w-16 transition-colors ${activeTab === 'plantel' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Users className="w-5 h-5" />
          Plantel
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-xs font-medium w-16 transition-colors ${activeTab === 'dashboard' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <BarChart3 className="w-5 h-5" />
          Métricas
        </button>
      </nav>
    </div>
  );
}