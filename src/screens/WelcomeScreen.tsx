import { useEffect, useState } from 'react';

interface WelcomeScreenProps {
  onFinish: () => void;
}

export default function WelcomeScreen({ onFinish }: WelcomeScreenProps) {
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    // Un intervalo que corre cada 50ms para llenar la barra en 5 segundos (5000ms)
    const intervalo = setInterval(() => {
      setProgreso((prev) => {
        if (prev >= 100) {
          clearInterval(intervalo);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    // Al cumplir los 5 segundos, llama a la función para pasar al menú
    const temporizador = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => {
      clearInterval(intervalo);
      clearTimeout(temporizador);
    };
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#110f24] to-[#1a1736] flex flex-col items-center justify-center p-6 text-center text-white select-none">
      
      {/* Contenedor del Logo de la Imagen recreado en SVG de alta definición */}
      <div className="w-64 h-64 mb-6 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] animate-pulse">
        <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Degradado Dorado del Huevo Externo */}
            <linearGradient id="bordeOro" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fceabb" />
              <stop offset="50%" stopColor="#f8d184" />
              <stop offset="100%" stopColor="#c59f57" />
            </linearGradient>

            {/* Degradado Metalizado Celeste del Interior */}
            <linearGradient id="celesteMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            
            {/* Sombra interna para el efecto 3D */}
            <filter id="sombra3D" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* 1. Silueta externa de Huevo en Oro */}
          <path 
            d="M 100,20 
               C 56,20 46,90 46,120 
               C 46,155 70,165 100,165 
               C 130,165 154,155 154,120 
               C 154,90 144,20 100,20 Z" 
            fill="url(#bordeOro)"
            filter="url(#sombra3D)"
          />

          {/* 2. Círculo Central Oscuro */}
          <path 
            d="M 100,32 
               C 66,32 58,88 58,112 
               C 58,140 76,148 100,148 
               C 124,148 142,140 142,112 
               C 142,88 134,32 100,32 Z" 
            fill="#0f1123" 
          />

          {/* 3. Arco Celeste Superior (Cielo del paisaje) */}
          <path 
            d="M 68,78 Q 100,55 132,78 Q 100,75 68,78"
            fill="url(#celesteMetal)"
          />

          {/* 4. Campo en perspectiva con surcos (Diseño del logotipo de la imagen) */}
          <g fill="url(#celesteMetal)">
            {/* Surco superior derecho */}
            <path d="M 137,86 C 110,95 90,110 77,131 C 86,118 106,105 137,92 Z" />
            {/* Surco central */}
            <path d="M 132,101 C 110,111 90,126 71,141 C 80,128 102,117 132,107 Z" />
          </g>

          {/* 5. Ramitas con Hojas Celestes (Representando el campo vivo) */}
          <g fill="url(#celesteMetal)">
            {/* Ramita izquierda inferior */}
            <path d="M 67,112 Q 62,102 57,110 C 62,115 65,120 67,112" />
            <path d="M 69,116 Q 75,108 72,116 C 68,122 66,122 69,116" />
            <circle cx="68" cy="115" r="1.5" />

            {/* Ramita izquierda media */}
            <circle cx="79" cy="98" r="1.5" />
            <path d="M 78,96 Q 74,88 71,94 C 74,98 76,101 78,96" />
            <path d="M 80,99 Q 86,93 83,99 C 80,103 78,103 80,99" />

            {/* Ramas derechas inferiores en el surco */}
            <circle cx="106" cy="125" r="1.5" />
            <path d="M 105,123 Q 101,114 97,121 C 100,125 102,128 105,123" />
            <path d="M 107,126 Q 113,120 110,126 C 107,130 105,130 107,126" />

            {/* Ramitas superiores en el horizonte */}
            <circle cx="94" cy="78" r="1.2" />
            <circle cx="107" cy="76" r="1.2" />
            <circle cx="120" cy="75" r="1.2" />
          </g>
        </svg>
      </div>

      {/* Título y Eslogan */}
      <div className="space-y-1 max-w-sm mb-10">
        <h1 className="text-[36px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7dd3fc] to-[#22d3ee] tracking-wider leading-none">
          HUEVOS HLE
        </h1>
        <p className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.25em] py-1 border-t border-b border-cyan-500/20">
          Tu proteína del campo a la mesa
        </p>
      </div>

      {/* Barra de progreso y estado de Carga */}
      <div className="w-64 space-y-3">
        <div className="flex justify-between items-center text-xs text-cyan-400 font-bold tracking-wider">
          <span className="animate-pulse">CARGANDO SISTEMA...</span>
          <span>{progreso}%</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-cyan-500/10 p-[1.5px]">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-75"
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
      </div>

      {/* Indicador de Servidor */}
      <div className="absolute bottom-6 flex items-center gap-2 justify-center text-[10px] text-slate-500 tracking-widest font-semibold uppercase">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        Conectando con Servidor Supabase
      </div>
    </div>
  );
}