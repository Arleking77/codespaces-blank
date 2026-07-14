import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface VentasScreenProps {
  clientes: any[];
  precios: any[];
  ciudades: any[];
  cargarDatos: () => void;
}

export default function VentasScreen({ clientes, precios, ciudades, cargarDatos }: VentasScreenProps) {
  const [subTab, setSubTab] = useState<'registrar' | 'cliente'>('registrar');

  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedFormato, setSelectedFormato] = useState('');
  const [cantidadVenta, setCantidadVenta] = useState<string>('1');
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [totalVenta, setTotalVenta] = useState(0);

  const [nuevoNombreCliente, setNuevoNombreCliente] = useState('');
  const [selectedCiudad, setSelectedCiudad] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [direccionCliente, setDireccionCliente] = useState('');

  useEffect(() => {
    if (selectedFormato) {
      const precioEncontrado = precios.find((p) => p.llave_combinada === selectedFormato);
      if (precioEncontrado) {
        const valorUnitario = precioEncontrado.precio_venta || 0;
        setPrecioUnitario(valorUnitario);
        const cantidadNumerica = parseInt(cantidadVenta) || 0;
        setTotalVenta(valorUnitario * cantidadNumerica);
      }
    } else {
      setPrecioUnitario(0);
      setTotalVenta(0);
    }
  }, [selectedFormato, cantidadVenta, precios]);

  const handleConfirmarVenta = async () => {
    if (!selectedCliente || !selectedFormato) {
      alert("Error: Por favor selecciona un cliente y formato.");
      return;
    }
    const cant = parseInt(cantidadVenta) || 0;
    if (cant <= 0) {
      alert("Error: Ingresa una cantidad mayor a 0.");
      return;
    }

    try {
      const { error } = await supabase.from('ventas').insert([
        {
          cliente_id: parseInt(selectedCliente),
          llave_precio: selectedFormato,
          unidades_formato: cant,
          precio_unitario_aplicado: precioUnitario,
          monto_total: totalVenta,
          fecha: new Date().toISOString().split('T')[0],
        },
      ]);

      if (error) {
        if (error.code === '23503') {
          throw new Error("El cliente o producto seleccionado no está registrado en el servidor.");
        }
        throw error;
      }

      alert("¡Venta guardada exitosamente en la ruta!");
      setSelectedCliente('');
      setSelectedFormato('');
      setCantidadVenta('1');
      cargarDatos();
    } catch (err: any) {
      alert(`Falla de Guardado: ${err.message}`);
    }
  };

  const handleGuardarCliente = async () => {
    if (!nuevoNombreCliente.trim()) {
      alert("Ingresa el nombre del cliente.");
      return;
    }
    try {
      const tieneCiudadesReales = ciudades && ciudades.length > 0;
      const idCiudadFinal = (tieneCiudadesReales && selectedCiudad) ? parseInt(selectedCiudad) : null;

      const { error } = await supabase.from('clientes').insert([
        {
          nombre: nuevoNombreCliente,
          ciudad_id: idCiudadFinal,
          telefono: telefonoCliente,
          direccion: direccionCliente,
        },
      ]);
      if (error) throw error;

      alert("¡Cliente registrado exitosamente!");
      setNuevoNombreCliente('');
      setSelectedCiudad('');
      setTelefonoCliente('');
      setDireccionCliente('');
      setSubTab('registrar');
      cargarDatos();
    } catch (err: any) {
      alert(`Error al crear cliente: ${err.message}`);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[12px] text-[#444651] uppercase tracking-wider font-semibold">Módulo Comercial</p>
          <h2 className="text-[24px] font-bold text-[#191c1d]">Ruta de Despacho</h2>
        </div>
        <div className="flex bg-gray-200 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setSubTab('registrar')}
            className={`px-3 py-1.5 rounded-md ${subTab === 'registrar' ? 'bg-white shadow text-[#00236f]' : 'text-gray-500'}`}
          >
            Nueva Venta
          </button>
          <button
            onClick={() => setSubTab('cliente')}
            className={`px-3 py-1.5 rounded-md ${subTab === 'cliente' ? 'bg-white shadow text-[#00236f]' : 'text-gray-500'}`}
          >
            Nuevo Cliente
          </button>
        </div>
      </div>

      {subTab === 'registrar' ? (
        <div className="bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#444651]">Cliente de la Ruta</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-[15px]"
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
            >
              <option value="">Selecciona un cliente...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#444651]">Formato de Venta</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-[15px]"
              value={selectedFormato}
              onChange={(e) => setSelectedFormato(e.target.value)}
            >
              <option value="">Selecciona un formato...</option>
              {precios.map((p) => (
                <option key={p.id} value={p.llave_combinada}>
                  {p.llave_combinada} (${p.precio_venta.toLocaleString('es-CL')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#444651]">Cantidad (Formatos)</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCantidadVenta((prev) => Math.max(1, (parseInt(prev) || 0) - 1).toString())}
                className="w-12 h-12 bg-gray-100 rounded-lg font-bold text-xl active:scale-95"
              >
                -
              </button>
              <input
                type="text"
                pattern="[0-9]*"
                className="flex-1 text-center border border-gray-300 rounded-lg p-2.5 text-lg font-semibold"
                placeholder="0"
                value={cantidadVenta}
                onChange={(e) => {
                  const val = e.target.value;
                  setCantidadVenta(val === '' ? '' : val.replace(/[^0-9]/g, ''));
                }}
              />
              <button
                type="button"
                onClick={() => setCantidadVenta((prev) => ((parseInt(prev) || 0) + 1).toString())}
                className="w-12 h-12 bg-gray-100 rounded-lg font-bold text-xl active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-dashed border-gray-200 space-y-1">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Precio del Formato Aplicado:</span>
              <span>${precioUnitario.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-[#191c1d]">
              <span>Monto Total a Cobrar:</span>
              <span className="text-[#00236f]">${totalVenta.toLocaleString('es-CL')}</span>
            </div>
          </div>

          <button
            onClick={handleConfirmarVenta}
            className="w-full h-12 bg-[#006c49] text-white font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">add</span>
            Confirmar Venta
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#c5c5d3] rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[#444651] border-b pb-2">Registrar Nuevo Cliente</h3>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#444651]">Nombre del Cliente o Local</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2.5"
              placeholder="Ej: Almacén Los Thompsons"
              value={nuevoNombreCliente}
              onChange={(e) => setNuevoNombreCliente(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#444651]">Ciudad / Comuna</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-white"
              value={selectedCiudad}
              onChange={(e) => setSelectedCiudad(e.target.value)}
            >
              <option value="">Selecciona Comuna...</option>
              {ciudades && ciudades.length > 0 ? (
                ciudades.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))
              ) : (
                <>
                  <option value="9">La Florida</option>
                  <option value="10">Santiago</option>
                  <option value="11">Puente Alto</option>
                  <option value="12">San Bernardo</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#444651]">Teléfono</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2.5"
              placeholder="Ej: +56912345678"
              value={telefonoCliente}
              onChange={(e) => setTelefonoCliente(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#444651]">Dirección</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2.5"
              placeholder="Calle, Pasaje, Número"
              value={direccionCliente}
              onChange={(e) => {
                setDireccionCliente(e.target.value);
              }}
            />
          </div>

          <button
            onClick={handleGuardarCliente}
            className="w-full h-12 bg-[#00236f] text-white font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">person_add</span>
            Guardar Cliente
          </button>
        </div>
      )}
    </section>
  );
}