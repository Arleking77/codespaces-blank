import React from 'react';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 h-16 w-full z-50 bg-white border-b border-[#c5c5d3] sticky top-0">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[#00236f]">egg</span>
        <h1 className="text-[20px] font-bold text-[#00236f]">Huevos HLE</h1>
      </div>
      <div className="flex items-center gap-2 px-3 py-1 bg-[#6cf8bb]/30 rounded-full">
        <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
        <span className="text-[14px] font-semibold text-[#00714d]">Sincronizado</span>
      </div>
    </header>
  );
}