import React from 'react';

export function SpbeBanner(): React.JSX.Element {
  return (
    <div
      role="banner"
      aria-label="Pita Resmi Pemerintah Republik Indonesia"
      className="w-full bg-[#BE0000] text-white text-xs font-medium tracking-wide py-1.5 px-4 sm:px-8 flex items-center justify-between border-b border-red-900 shadow-xs z-30"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Bendera Merah Putih Mini SVG */}
          <span
            className="inline-flex w-4 h-3 rounded-[2px] overflow-hidden border border-white/40 shadow-xs shrink-0"
            aria-hidden="true"
          >
            <span className="w-full h-1/2 bg-red-600 block" />
            <span className="w-full h-1/2 bg-white block" />
          </span>
          <span className="text-[11px] sm:text-xs tracking-wider uppercase font-semibold">
            INA DIGITAL <span className="opacity-60 mx-1">|</span> Sistem Pemerintahan Berbasis Elektronik (SPBE)
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[11px] text-white/90">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Layanan Resmi Pemerintah RI</span>
          <span className="opacity-40">•</span>
          <span>NOC & CSIRT Aktif 24/7</span>
        </div>
      </div>
    </div>
  );
}
