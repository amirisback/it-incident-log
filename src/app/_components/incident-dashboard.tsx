'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  IconSearch,
  IconFilter,
  IconRefresh,
  IconCircleCheck,
  IconClock,
  IconFlame,
  IconEye,
  IconTrash,
  IconPlus,
} from '@tabler/icons-react';
import { Button, Pagination } from '@idds/react';
import { StatCard } from './stat-card';
import { IncidentStatusBadge, IncidentSeverityBadge } from './incident-badge';
import { EmptyState } from './empty-state';
import { DetailModal } from './detail-modal';
import { ReportModal } from './report-modal';
import { DeleteDialog } from './delete-dialog';
import { fetchIncidents, fetchIncidentStats } from '@/lib/api-client';
import { Incident, IncidentStats } from '@/types/incident';

interface IncidentDashboardProps {
  initialIncidents: Incident[];
  initialStats: IncidentStats;
  isReportModalOpen: boolean;
  onCloseReportModal: () => void;
  onOpenReportModal: () => void;
}

const CATEGORIES = [
  'Semua',
  'Jaringan',
  'Server & Cloud',
  'Aplikasi Web',
  'Database',
  'Keamanan Siber',
  'Perangkat Keras',
];

const SEVERITIES = ['Semua', 'Rendah', 'Sedang', 'Tinggi', 'Kritis'];

const STATUSES = ['Semua', 'TERLAPOR', 'DIINVESTIGASI', 'DITANGANI', 'SELESAI', 'DITUTUP'];

export function IncidentDashboard({
  initialIncidents,
  initialStats,
  isReportModalOpen,
  onCloseReportModal,
  onOpenReportModal,
}: IncidentDashboardProps): React.JSX.Element {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [stats, setStats] = useState<IncidentStats>(initialStats);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedSeverity, setSelectedSeverity] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(initialIncidents.length);

  const [isLoading, setIsLoading] = useState(false);

  // Selected Incident for Detail and Delete
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [incidentToDelete, setIncidentToDelete] = useState<Incident | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Reload data from backend REST API
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [incidentsRes, statsRes] = await Promise.all([
        fetchIncidents({
          search,
          category: selectedCategory,
          severity: selectedSeverity,
          status: selectedStatus,
          page: currentPage,
          limit: pageSize,
        }),
        fetchIncidentStats(),
      ]);

      if (incidentsRes.success && incidentsRes.data) {
        setIncidents(incidentsRes.data);
        if (incidentsRes.meta) {
          setTotalItems(incidentsRes.meta.total);
          setTotalPages(incidentsRes.meta.totalPages);
        }
      }
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data insiden:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, selectedSeverity, selectedStatus, currentPage, pageSize]);

  // Trigger refresh on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshData();
    }, 250);
    return () => clearTimeout(timer);
  }, [refreshData]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('Semua');
    setSelectedSeverity('Semua');
    setSelectedStatus('Semua');
    setCurrentPage(1);
  };

  const handleIncidentCreated = () => {
    refreshData();
  };

  const handleIncidentUpdated = (updated: Incident) => {
    setIncidents((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setSelectedIncident(updated);
    fetchIncidentStats().then((res) => {
      if (res.success && res.data) setStats(res.data);
    });
  };

  const handleIncidentDeleted = (deletedId: string) => {
    setIncidents((prev) => prev.filter((item) => item.id !== deletedId));
    if (selectedIncident?.id === deletedId) {
      setIsDetailModalOpen(false);
      setSelectedIncident(null);
    }
    fetchIncidentStats().then((res) => {
      if (res.success && res.data) setStats(res.data);
    });
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8">
      {/* KPI Stats Cards Grid */}
      <section aria-label="Ringkasan Metrik Gangguan TI">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Gangguan Tercatat"
            value={stats.total}
            subtitle="Seluruh insiden SPBE nasional"
            icon={<IconFilter className="w-6 h-6" />}
            variant="brand"
          />
          <StatCard
            title="Insiden Kritis Aktif"
            value={stats.critical}
            subtitle="Prioritas penanganan darurat"
            icon={<IconFlame className="w-6 h-6" />}
            variant="danger"
          />
          <StatCard
            title="Sedang Ditangani NOC"
            value={stats.inProgress}
            subtitle="Tahap investigasi & mitigasi"
            icon={<IconClock className="w-6 h-6" />}
            variant="warning"
          />
          <StatCard
            title="Telah Terselesaikan"
            value={stats.resolved}
            subtitle={`Rata-rata ${stats.avgDowntimeMinutes} menit pemulihan`}
            icon={<IconCircleCheck className="w-6 h-6" />}
            variant="success"
          />
        </div>
      </section>

      {/* Kontrol Pencarian, Filter & Tombol Tambah */}
      <section
        className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
        aria-label="Filter dan Pencarian Insiden"
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Input Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <IconSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari nomor tiket, judul insiden, atau sistem terdampak..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#196bcd] focus:bg-white dark:focus:bg-zinc-800 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCurrentPage(1);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={refreshData}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#196bcd] transition-colors"
              title="Perbarui Data"
              aria-label="Perbarui Data"
            >
              <IconRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <Button
              hierarchy="primary"
              size="md"
              onClick={onOpenReportModal}
              prefixIcon={<IconPlus className="w-4 h-4" stroke={2.5} />}
              className="!rounded-xl font-semibold shadow-xs"
            >
              Lapor Gangguan
            </Button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          {/* Filter Kategori */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#196bcd]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Urgensi */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Urgensi
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#196bcd]"
            >
              {SEVERITIES.map((sev) => (
                <option key={sev} value={sev}>
                  {sev}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#196bcd]"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Aktif & Reset */}
        {(search || selectedCategory !== 'Semua' || selectedSeverity !== 'Semua' || selectedStatus !== 'Semua') && (
          <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
            <span>
              Menampilkan hasil filter{' '}
              <strong>
                {incidents.length} dari {totalItems} catatan
              </strong>
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#196bcd] hover:underline font-semibold"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </section>

      {/* Tabel Data Gangguan (Desktop/Tablet) & Card View (Mobile) */}
      <section
        className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden"
        aria-label="Daftar Catatan Gangguan TI"
      >
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Daftar Insiden Terpantau
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Catatan gangguan pada infrastruktur dan aplikasi SPBE
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#196bcd] dark:bg-blue-950/60 dark:text-blue-300">
            {totalItems} Catatan
          </span>
        </div>

        {incidents.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title={totalItems === 0 && !search && selectedCategory === 'Semua' && selectedSeverity === 'Semua' && selectedStatus === 'Semua' ? "Belum Ada Catatan Gangguan" : "Tidak Ada Catatan Gangguan"}
              description={
                totalItems === 0 && !search && selectedCategory === 'Semua' && selectedSeverity === 'Semua' && selectedStatus === 'Semua'
                  ? "Database insiden saat ini bersih untuk persiapan ujian. Silakan klik tombol di bawah untuk mencatat laporan gangguan baru."
                  : "Tidak ada data insiden yang sesuai dengan filter atau kata kunci pencarian Anda."
              }
              actionLabel={totalItems === 0 && !search && selectedCategory === 'Semua' && selectedSeverity === 'Semua' && selectedStatus === 'Semua' ? "Lapor Gangguan Baru" : "Reset Filter"}
              onAction={totalItems === 0 && !search && selectedCategory === 'Semua' && selectedSeverity === 'Semua' && selectedStatus === 'Semua' ? onOpenReportModal : handleResetFilters}
            />
          </div>
        ) : (
          <>
            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-zinc-50/80 dark:bg-zinc-800/50 text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Nomor Tiket
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Judul & Layanan
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Kategori
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Urgensi
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold">
                      Waktu
                    </th>
                    <th scope="col" className="py-3 px-4 font-semibold text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {incidents.map((incident) => (
                    <tr
                      key={incident.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedIncident(incident);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      {/* Ticket Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        {incident.ticketNumber}
                      </td>

                      {/* Judul & Layanan */}
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-[#196bcd] transition-colors line-clamp-1">
                          {incident.title}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                          {incident.affectedService}
                        </p>
                      </td>

                      {/* Kategori */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                        {incident.category}
                      </td>

                      {/* Urgensi */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <IncidentSeverityBadge severity={incident.severity} />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <IncidentStatusBadge status={incident.status} />
                      </td>

                      {/* Waktu */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-zinc-500">
                        {formatDate(incident.reportedAt)}
                      </td>

                      {/* Aksi */}
                      <td
                        className="py-3.5 px-4 whitespace-nowrap text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedIncident(incident);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-[#196bcd] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="Lihat Detail Gangguan"
                            aria-label={`Detail gangguan ${incident.ticketNumber}`}
                          >
                            <IconEye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIncidentToDelete(incident);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Hapus Catatan Insiden"
                            aria-label={`Hapus insiden ${incident.ticketNumber}`}
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (< 768px) */}
            <div className="md:hidden divide-y divide-zinc-200 dark:divide-zinc-800">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => {
                    setSelectedIncident(incident);
                    setIsDetailModalOpen(true);
                  }}
                  className="p-4 space-y-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {incident.ticketNumber}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <IncidentSeverityBadge severity={incident.severity} size="sm" />
                      <IncidentStatusBadge status={incident.status} size="sm" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                      {incident.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                      {incident.affectedService} • {incident.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-zinc-400">
                    <span>{formatDate(incident.reportedAt)}</span>
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIncident(incident);
                          setIsDetailModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-md text-xs font-medium text-[#196bcd] bg-blue-50 dark:bg-blue-950/50"
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIncidentToDelete(incident);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="p-1 text-zinc-400 hover:text-red-600"
                        aria-label="Hapus"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* IDDS Pagination Component */}
            {totalItems > 0 && (
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Menampilkan halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> (Total <strong>{totalItems}</strong> insiden)
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  pageSizeOptions={[5, 10, 20, 50]}
                  onPageChange={(page) => setCurrentPage(page)}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                  disabled={isLoading}
                />
              </div>
            )}
          </>
        )}
      </section>

      {/* Modals */}
      <ReportModal
        open={isReportModalOpen}
        onClose={onCloseReportModal}
        onSuccess={handleIncidentCreated}
      />

      <DetailModal
        incident={selectedIncident}
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedIncident(null);
        }}
        onDeleteRequest={(inc) => {
          setIsDetailModalOpen(false);
          setIncidentToDelete(inc);
          setIsDeleteDialogOpen(true);
        }}
        onIncidentUpdated={handleIncidentUpdated}
      />

      <DeleteDialog
        incident={incidentToDelete}
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setIncidentToDelete(null);
        }}
        onSuccess={handleIncidentDeleted}
      />
    </div>
  );
}
