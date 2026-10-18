import React from 'react';
import Link from 'next/link';
import {
  IconShieldCheck,
  IconPhoneCall,
  IconMail,
  IconServer,
  IconExternalLink,
} from '@tabler/icons-react';

export function SpbeFooter(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-900 text-zinc-300 border-t border-zinc-800 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Kolom 1: Profil SI-GATI */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-sm">
                <IconShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">SI-GATI</span>
                <p className="text-xs text-zinc-400">Sistem Informasi Gangguan Layanan TI SPBE</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
              Portal terpadu pelaporan, pencatatan kronologis, dan eskalasi penanganan insiden infrastruktur, jaringan komunikasi data, basis data, dan aplikasi pelayanan publik pemerintahan Republik Indonesia.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700/60">
                <IconServer className="w-3.5 h-3.5 text-blue-400" />
                Standar SPBE Perpres 95/2018
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                INA Digital Design System (IDDS)
              </span>
            </div>
          </div>

          {/* Kolom 2: Kontak Darurat NOC & CSIRT */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Pusat Tanggap Insiden
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <IconPhoneCall className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-200 font-medium block">Hotline NOC 24 Jam:</span>
                  <span>159 (Pusat Kontak SPBE)</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <IconMail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-200 font-medium block">Surel Tim Teknis:</span>
                  <span>noc-spbe@layanan.go.id</span>
                </div>
              </li>
              <li className="pt-1 text-[11px] text-zinc-400 leading-normal">
                Eskalasi insiden ancaman keamanan siber kritis diproses langsung bersama Tim CSIRT Nasional BSSN.
              </li>
            </ul>
          </div>

          {/* Kolom 3: Tautan Ekosistem Terkait */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Ekosistem SPBE
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <a
                  href="https://inadigital.co.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  GovTech Indonesia (INA DIGITAL)
                  <IconExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://design.inadigital.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  INA Digital Design System
                  <IconExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://layanan.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  Portal Pelayanan Publik Nasional
                  <IconExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <Link href="/layanan" className="hover:text-white transition-colors">
                  Katalog Layanan Terpantau
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Garis Pembatas & Copyright */}
        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {currentYear} SI-GATI — Hak Cipta Dilindungi Undang-Undang Republik Indonesia.</p>
          <div className="flex items-center gap-4">
            <Link href="/layanan" className="hover:underline">
              SLA Pelayanan
            </Link>
            <span>•</span>
            <Link href="/lacak" className="hover:underline">
              Cek Status Tiket
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
