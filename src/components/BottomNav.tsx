import React from 'react';

interface BottomNavProps {
  activeTab: 'ventas' | 'produccion' | 'plantel' | 'metricas';
  setActiveTab: (tab: 'ventas' | 'produccion' | 'plantel' | 'metricas') => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'ventas', label: 'Ventas', icon: 'shopping_cart' },
    { id: 'produccion', label: 'Producción', icon: 'precision_manufacturing' },
    { id: 'plantel', label: 'Plantel', icon: 'groups' },
    { id: 'metricas', label: 'Métricas', icon: 'analytics' },
  ] as const;

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center bg-white border-t border-gray-200 h-20 px-4 shadow-[0px_-2px_10px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center justify-center pt-2 w-full h-full ${
            activeTab === tab.id ? 'text-[#00236f] border-t-2 border-[#00236f]' : 'text-gray-500'
          }`}
        >
          <span className="material-symbols-outlined">{tab.icon}</span>
          <span className="text-xs font-semibold">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}