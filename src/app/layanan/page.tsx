import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  IconArrowLeft,
  IconCheck,
  IconBuildingCommunity,
} from '@tabler/icons-react';
import { SpbeBanner } from '../_components/spbe-banner';
import { SpbeHeader } from '../_components/spbe-header';
import { SpbeFooter } from '../_components/spbe-footer';

export const metadata: Metadata = {
  title: 'Katalog Layanan & Standar SLA — SI-GATI',
  description: 'Daftar aplikasi dan infrastruktur SPBE yang dipantau serta standar Service Level Agreement (SLA) penanganan insiden.',
};

const MONITORED_SERVICES = [
  {
    name: 'SIASN (Sistem Informasi ASN)',
    agency: 'Badan Kepegawaian Negara (BKN)',
    category: 'Aplikasi Web & Database',
    uptimeTarget: '99.8%',
    description: 'Layanan administrasi kepegawaian terpadu seluruh ASN instansi pusat dan daerah Republik Indonesia.',
    status: 'Operational',
  },
  {
    name: 'SP4N-LAPOR!',
    agency: 'Kementerian PANRB',
    category: 'Aplikasi Web Publik',
    uptimeTarget: '99.5%',
    description: 'Portal aspirasi dan pengaduan pelayanan publik daring nasional bagi seluruh warga negara Indonesia.',
    status: 'Operational',
  },
  {
    name: 'Portal Satu Data Indonesia',
    agency: 'Kementerian PPN / Bappenas',
    category: 'API Gateway & Open Data',
    uptimeTarget: '99.5%',
    description: 'Pusat integrasi data statistik, geospasial, dan keuangan antar instansi kementerian/lembaga/pemda.',
    status: 'Operational',
  },
  {
    name: 'Pusat Data Nasional (PDN Cloud)',
    agency: 'Kementerian Komunikasi dan Digital',
    category: 'Server & Cloud PDN',
    uptimeTarget: '99.9%',
    description: 'Infrastruktur komputasi awan dan penyimpanan data terpusat instansi pemerintah Indonesia.',
    status: 'Operational',
  },
  {
    name: 'INAgov SSO (Identitas ASN Terpadu)',
    agency: 'GovTech Indonesia / INA DIGITAL',
    category: 'Autentikasi & Keamanan',
    uptimeTarget: '99.95%',
    description: 'Gerbang masuk terintegrasi satu akun bagi aparatur sipil negara dalam mengakses seluruh sistem SPBE.',
    status: 'Operational',
  },
  {
    name: 'BSrE Otoritas TTE (Sertifikat Elektronik)',
    agency: 'Balai Sertifikasi Elektronik - BSSN',
    category: 'Keamanan Siber & TTE',
    uptimeTarget: '99.9%',
    description: 'Infrastruktur Public Key Infrastructure (PKI) untuk verifikasi keabsahan dan penandatanganan dokumen elektronik.',
    status: 'Operational',
  },
];

const SLA_TARGETS = [
  {
    level: 'Kritis',
    responseTime: '< 15 Menit',
    resolutionTime: '< 2 Jam',
    description: 'Dampak masif yang melumpuhkan pelayanan publik utama atau keamanan nasional.',
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200',
  },
  {
    level: 'Tinggi',
    responseTime: '< 30 Menit',
    resolutionTime: '< 4 Jam',
    description: 'Degradasi sistem signifikan yang memengaruhi ribuan pengguna instansi pemerintah.',
    badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200',
  },
  {
    level: 'Sedang',
    responseTime: '< 1 Jam',
    resolutionTime: '< 8 Jam',
    description: 'Gangguan pada sebagian fitur atau modul non-kritis dengan jalur alternatif tersedia.',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200',
  },
  {
    level: 'Rendah',
    responseTime: '< 2 Jam',
    resolutionTime: '< 24 Jam',
    description: 'Permasalahan minor, anomali tampilan, atau permintaan dukungan teknis operasional rutin.',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200',
  },
];

export default function ServicesPage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-50 transition-colors">
      <SpbeBanner />
      <SpbeHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#196bcd] hover:underline"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Dasbor Pemantauan
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Katalog Layanan Terpantau & Standar SLA
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Informasi daftar sistem pemerintahan berbasis elektronik (SPBE) dalam pengawasan pusat NOC/CSIRT serta target Service Level Agreement (SLA) eskalasi penanganan insiden.
          </p>
        </div>

        {/* Tabel Target Standar SLA */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Standar Target Waktu Respons & Pemulihan (SLA)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Target eskalasi teknis berdasarkan klasifikasi tingkat urgensi insiden SPBE
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {SLA_TARGETS.map((sla) => (
              <div
                key={sla.level}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border ${sla.badgeClass}`}
                  >
                    Tingkat {sla.level}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400">Waktu Respon: <strong className="text-zinc-900 dark:text-zinc-100">{sla.responseTime}</strong></p>
                  <p className="text-xs text-zinc-400">Target Pulih: <strong className="text-zinc-900 dark:text-zinc-100">{sla.resolutionTime}</strong></p>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {sla.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Katalog Sistem Terpantau */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Daftar Sistem & Infrastruktur Dalam Pemantauan NOC
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Seluruh sistem di bawah ini terhubung ke sensor pemantauan real-time SI-GATI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONITORED_SERVICES.map((srv) => (
              <div
                key={srv.name}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {srv.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Target {srv.uptimeTarget}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {srv.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <IconBuildingCommunity className="w-3.5 h-3.5 shrink-0" />
                    <span className="line-clamp-1">{srv.agency}</span>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Status Monitoring:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <IconCheck className="w-3.5 h-3.5" />
                    Aktif Terhubung
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SpbeFooter />
    </div>
  );
}
