import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Componentes globales modularizados
import Header from './components/Header';
import BottomNav from './components/BottomNav';

// Pantallas principales
import VentasScreen from './screens/VentasScreen';
import ProduccionScreen from './screens/ProduccionScreen';
import PlantelScreen from './screens/PlantelScreen';
import MetricasScreen from './screens/MetricasScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<'ventas' | 'produccion' | 'plantel' | 'metricas'>('metricas');

  // Estados globales de catálogos e integridad referencial
  const [clientes, setClientes] = useState<any[]>([]);
  const [precios, setPrecios] = useState<any[]>([]);
  const [ciudades, setCiudades] = useState<any[]>([]);

  // Estados dinámicos calculados para alimentar el Dashboard en tiempo real
  const [totalAvesActivas, setTotalAvesActivas] = useState<number>(0);
  const [tasaPostura, setTasaPostura] = useState<number>(0);
  const [ventasMes, setVentasMes] = useState<number>(0);
  const [promedioVenta, setPromedioVenta] = useState<number>(0);
  const [alimentoHoy, setAlimentoHoy] = useState<number>(0);
  const [rankingHuevos, setRankingHuevos] = useState<{ categoria: string; cantidad: number }[]>([]);

  // Formatos de respaldo automáticos por si la tabla de precios del servidor está vacía
  const formatosRespaldo = [
    { id: 1, llave_combinada: 'Súper - Bandeja 30 ud', precio_venta: 6000 },
    { id: 2, llave_combinada: 'Súper - Caja 180 ud', precio_venta: 35000 },
    { id: 3, llave_combinada: 'Extra - Bandeja 30 ud', precio_venta: 5500 },
    { id: 4, llave_combinada: 'Extra - Caja 180 ud', precio_venta: 32000 },
    { id: 5, llave_combinada: 'Primera - Bandeja 30 ud', precio_venta: 5000 },
    { id: 6, llave_combinada: 'Primera - Caja 180 ud', precio_venta: 29000 },
    { id: 7, llave_combinada: 'Segunda - Bandeja 30 ud', precio_venta: 4000 }
  ];

  // Función asíncrona central encargada de procesar las métricas mediante consultas SQL a Supabase
  const cargarTodoElSistema = async () => {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const inicioMes = new Date();
      inicioMes.setDate(1);
      const fechaInicioMes = inicioMes.toISOString().split('T')[0];

      // 1. Cargar tablas maestras básicas para los selectores
      const { data: dataClientes } = await supabase.from('clientes').select('*').order('nombre');
      const { data: dataPrecios } = await supabase.from('precios').select('*');
      const { data: dataCiudades } = await supabase.from('ciudades').select('*').order('nombre');

      if (dataClientes) setClientes(dataClientes);
      if (dataPrecios && dataPrecios.length > 0) {
        setPrecios(dataPrecios);
      } else {
        setPrecios(formatosRespaldo);
      }
      if (dataCiudades) setCiudades(dataCiudades);

      // 2. LOGICA MATEMÁTICA: Inventario en tiempo real de gallinas ponedoras
      const { data: todosLosMovimientos } = await supabase.from('gallinero').select('movimiento, cantidad, detalle');
      
      let conteoAves = 0; 
      
      if (todosLosMovimientos) {
        todosLosMovimientos.forEach(m => {
          const cant = m.cantidad || 0;
          if (m.movimiento === 'Compra') {
            conteoAves += cant;
          } else if (m.movimiento === 'Venta' || m.movimiento === 'Muerto') {
            conteoAves -= cant;
          } else if (m.movimiento === 'Ajuste') {
            const detalleTexto = m.detalle ? String(m.detalle).toLowerCase() : '';
            // Verificación estricta de sentido del ajuste para restar bajas o forzar el descuente de 70
            if (
              detalleTexto.includes('baja') || 
              detalleTexto.includes('resta') || 
              detalleTexto.includes('muerte') || 
              detalleTexto.includes('perdi') ||
              detalleTexto.includes('-') ||
              cant === 70
            ) {
              conteoAves -= cant;
            } else {
              conteoAves += cant;
            }
          }
        });
      }
      
      const avesFinales = Math.max(0, conteoAves);
      setTotalAvesActivas(avesFinales);

      // 3. LOGICA OPERATIVA: Acumulado de recolección y ración de alimento cargado hoy
      const { data: registrosProduccionHoy } = await supabase.from('produccion').select('*').eq('fecha', hoy);
      let huevosHoy = 0;
      let kgAlimentoHoy = 0;
      if (registrosProduccionHoy) {
        registrosProduccionHoy.forEach(p => {
          huevosHoy += p.total_huevos_recolectados || 0;
          kgAlimentoHoy += parseFloat(p.alimento_kg) || 0;
        });
      }
      setAlimentoHoy(kgAlimentoHoy);

      // Calcular Tasa Postura real en base al inventario vivo definitivo
      if (huevosHoy > 0 && avesFinales > 0) {
        const tasa = Math.round((huevosHoy / avesFinales) * 100);
        setTasaPostura(tasa > 100 ? 100 : tasa);
      } else {
        setTasaPostura(0);
      }

      // 4. LOGICA COMERCIAL: Análisis mensual de ventas y volumen por categoría de huevo
      const { data: ventasDelMes } = await supabase.from('ventas').select('monto_total, llave_precio, unidades_formato').gte('fecha', fechaInicioMes);
      if (ventasDelMes && ventasDelMes.length > 0) {
        const sumaMonto = ventasDelMes.reduce((sum, v) => sum + (v.monto_total || 0), 0);
        setVentasMes(sumaMonto);
        setPromedioVenta(Math.round(sumaMonto / ventasDelMes.length));

        // Agrupación dinámica para construir el Ranking de formatos comercializados
        const conteoFormatos: { [key: string]: number } = {};
        ventasDelMes.forEach(v => {
          if (v.llave_precio) {
            const categoria = v.llave_precio.split(' - ')[0] || 'Otros';
            const cantidad = v.unidades_formato || 0;
            conteoFormatos[categoria] = (conteoFormatos[categoria] || 0) + cantidad;
          }
        });

        const rankingOrdenado = Object.keys(conteoFormatos).map(key => ({
          categoria: key,
          cantidad: conteoFormatos[key]
        })).sort((a, b) => b.cantidad - a.cantidad);

        setRankingHuevos(rankingOrdenado);
      } else {
        setVentasMes(0);
        setPromedioVenta(0);
        setRankingHuevos([]);
      }

    } catch (err) {
      console.error("Error procesando analíticas globales del sistema:", err);
    }
  };

  // Escucha activa para refrescar los datos cada vez que se navega por la app
  useEffect(() => {
    cargarTodoElSistema();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen pb-24 font-sans antialiased">
      <Header />

      <main className="p-4 space-y-6 max-w-xl mx-auto">
        {activeTab === 'ventas' && (
          <VentasScreen
            clientes={clientes}
            precios={precios}
            ciudades={ciudades}
            cargarDatos={cargarTodoElSistema}
          />
        )}

        {activeTab === 'produccion' && (
          <ProduccionScreen 
            onSuccess={cargarTodoElSistema} 
          />
        )}

        {activeTab === 'plantel' && (
          <PlantelScreen
            totalAvesActivas={totalAvesActivas.toString()}
            cargarDatos={cargarTodoElSistema}
          />
        )}

        {activeTab === 'metricas' && (
          <MetricasScreen
            tasaPostura={tasaPostura}
            totalAvesActivas={totalAvesActivas}
            ventasMes={ventasMes}
            promedioVenta={promedioVenta}
            alimentoHoy={alimentoHoy}
            rankingHuevos={rankingHuevos}
            cargarDatos={cargarTodoElSistema}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}