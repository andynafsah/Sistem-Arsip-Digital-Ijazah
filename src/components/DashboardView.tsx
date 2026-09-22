import React, { useState } from 'react';
import { 
  ArchiveRecord, 
  SystemStats 
} from '../types/archive';
import { 
  FileCheck2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  HardDrive, 
  FileWarning, 
  School, 
  GraduationCap,
  XCircle,
  FileCheck,
  Percent,
  CheckCircle,
  Table,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  stats: SystemStats;
  recentRecords: ArchiveRecord[];
  onSelectRecord: (record: ArchiveRecord) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentRecords,
  onSelectRecord,
  onNavigateTab
}) => {
  const [showSheetMap, setShowSheetMap] = useState(false);

  const units = [
    { key: 'SD', label: 'SD', count: stats.perUnit.SD || 0, color: 'from-blue-600 to-blue-700', cell: 'B8' },
    { key: 'SMP', label: 'SMP', count: stats.perUnit.SMP || 0, color: 'from-emerald-600 to-emerald-700', cell: 'B9' },
    { key: 'SMA', label: 'SMA', count: stats.perUnit.SMA || 0, color: 'from-indigo-600 to-indigo-700', cell: 'B10' },
    { key: 'PKBM', label: 'PKBM', count: stats.perUnit.PKBM || 0, color: 'from-amber-600 to-amber-700', cell: 'B11' },
    { key: 'Lainnya', label: 'Lainnya', count: stats.perUnit.Lainnya || 0, color: 'from-slate-600 to-slate-700', cell: 'B12' },
  ];

  const standardYears = ['2026', '2025', '2024', '2023', '2022'] as const;
  const yearCells: Record<string, string> = {
    '2026': 'D8',
    '2025': 'D9',
    '2024': 'D10',
    '2023': 'D11',
    '2022': 'D12',
  };

  return (
    <div className="space-y-6">
      {/* Welcome & System Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Sistem Terintegrasi Google Workspace — Sheet 04_DASHBOARD</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit',sans-serif]">
              Dashboard Arsip Digital Ijazah
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Sinkronisasi presisi antara antarmuka web dan spreadsheet Google Sheets (Sheet 04_DASHBOARD) Ma’had Darul Hadits Lima Puluh Kota.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSheetMap(!showSheetMap)}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 rounded-xl transition flex items-center space-x-1.5"
              title="Tampilkan peta koordinat sel spreadsheet"
            >
              <Table className="w-3.5 h-3.5" />
              <span>{showSheetMap ? 'Sembunyikan Koordinat Sel' : 'Peta Sel Sheet 04_DASHBOARD'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('database')}
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <span>🔍 Database (31 Kolom)</span>
            </button>
            <button
              onClick={() => onNavigateTab('gas')}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl transition flex items-center space-x-1.5"
            >
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              <span>Apps Script Hub</span>
            </button>
          </div>
        </div>

        {/* Live Sheet Grid Synchronized Map Modal/Drawer */}
        {showSheetMap && (
          <div className="mt-4 pt-4 border-t border-slate-700/80 text-xs animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Matriks Sinkronisasi 1-ke-1 dengan Google Spreadsheet (Sheet: 04_DASHBOARD)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Formula: IFERROR(COUNTIF / COUNTA)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-[11px]">
              <div className="p-2 bg-slate-950/80 rounded border border-blue-800/40 text-blue-300">
                <strong>Sel A5:</strong> TOTAL ARSIP ({stats.totalArsip})
              </div>
              <div className="p-2 bg-slate-950/80 rounded border border-emerald-800/40 text-emerald-300">
                <strong>Sel B5:</strong> TERVERIFIKASI ({stats.totalTerverifikasi})
              </div>
              <div className="p-2 bg-slate-950/80 rounded border border-amber-800/40 text-amber-300">
                <strong>Sel C5:</strong> BELUM DIVERIFIKASI ({stats.totalBelumVerifikasi})
              </div>
              <div className="p-2 bg-slate-950/80 rounded border border-orange-800/40 text-orange-300">
                <strong>Sel D5:</strong> PERLU PERBAIKAN ({stats.totalPerluPerbaikan})
              </div>
              <div className="p-2 bg-slate-950/80 rounded border border-rose-800/40 text-rose-300">
                <strong>Sel E5:</strong> TIDAK SESUAI ({stats.totalTidakSesuai})
              </div>
              <div className="p-2 bg-slate-950/80 rounded border border-purple-800/40 text-purple-300">
                <strong>Sel F5:</strong> BELUM LENGKAP ({stats.totalBelumLengkap})
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6 Primary KPI Cards (Sinkron Penuh dengan Baris 4 & 5 Sheet 04_DASHBOARD) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. TOTAL ARSIP (Sel A5) */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-blue-500/30 hover:border-blue-500/60 rounded-2xl p-4 shadow-lg shadow-black/30 relative group transition duration-200">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase">TOTAL ARSIP</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-blue-950/90 text-blue-300 border border-blue-700/40">Sel A5</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit',sans-serif] tracking-tight">
            {stats.totalArsip}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>Dokumen aktif</span>
            <Layers className="w-4 h-4 text-blue-400 opacity-70 group-hover:scale-110 transition-transform" />
          </p>
        </div>

        {/* 2. TERVERIFIKASI (Sel B5) */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-4 shadow-lg shadow-black/30 relative group transition duration-200">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase">TERVERIFIKASI</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-700/40">Sel B5</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-['Outfit',sans-serif] tracking-tight">
            {stats.totalTerverifikasi}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>{stats.persentaseVerifikasi}% disetujui</span>
            <FileCheck2 className="w-4 h-4 text-emerald-400 opacity-70 group-hover:scale-110 transition-transform" />
          </p>
        </div>

        {/* 3. BELUM DIVERIFIKASI (Sel C5) */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-4 shadow-lg shadow-black/30 relative group transition duration-200">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase">BELUM VERIF</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-amber-950/90 text-amber-300 border border-amber-700/40">Sel C5</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-['Outfit',sans-serif] tracking-tight">
            {stats.totalBelumVerifikasi}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>Antrean admin</span>
            <Clock className="w-4 h-4 text-amber-400 opacity-70 group-hover:scale-110 transition-transform" />
          </p>
        </div>

        {/* 4. PERLU PERBAIKAN (Sel D5) */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-orange-500/30 hover:border-orange-500/60 rounded-2xl p-4 shadow-lg shadow-black/30 relative group transition duration-200">
          <div className="flex items-center justify-between text-orange-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase">PERBAIKAN</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-orange-950/90 text-orange-300 border border-orange-700/40">Sel D5</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-300 font-['Outfit',sans-serif] tracking-tight">
            {stats.totalPerluPerbaikan}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>Scan blur / revisi</span>
            <AlertTriangle className="w-4 h-4 text-orange-400 opacity-70 group-hover:scale-110 transition-transform" />
          </p>
        </div>

        {/* 5. DOKUMEN TIDAK SESUAI (Sel E5) */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-rose-500/30 hover:border-rose-500/60 rounded-2xl p-4 shadow-lg shadow-black/30 relative group transition duration-200">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase">TIDAK SESUAI</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-rose-950/90 text-rose-300 border border-rose-700/40">Sel E5</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-300 font-['Outfit',sans-serif] tracking-tight">
            {stats.totalTidakSesuai}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>Data tak cocok</span>
            <XCircle className="w-4 h-4 text-rose-400 opacity-70 group-hover:scale-110 transition-transform" />
          </p>
        </div>

        {/* 6. BELUM LENGKAP (Sel F5) */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-4 shadow-lg shadow-black/30 relative group transition duration-200">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase">BELUM LENGKAP</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-purple-950/90 text-purple-300 border border-purple-700/40">Sel F5</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-['Outfit',sans-serif] tracking-tight">
            {stats.totalBelumLengkap}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>Berkas kurang</span>
            <FileWarning className="w-4 h-4 text-purple-400 opacity-70 group-hover:scale-110 transition-transform" />
          </p>
        </div>
      </div>

      {/* 3 Section Distribusi & Integritas (Persis Tabel Baris 7 - 12 Sheet 04_DASHBOARD) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Kolom A:B (Baris 7-12) - JUMLAH PER UNIT */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <School className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit',sans-serif]">
                  Jumlah Per Unit
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-blue-300 rounded border border-blue-800/40">
                Kolom A:B (Baris 8-12)
              </span>
            </div>

            <div className="space-y-2.5">
              {units.map((u) => {
                const percentage = stats.totalArsip > 0 ? Math.round((u.count / stats.totalArsip) * 100) : 0;
                return (
                  <div key={u.key} className="p-2.5 bg-slate-900/70 border border-slate-700/60 rounded-xl">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 w-6">[{u.cell}]</span>
                        <span className="font-semibold text-slate-200">{u.label}</span>
                      </div>
                      <span className="font-mono font-bold text-white px-2 py-0.5 bg-slate-800 rounded border border-slate-700">
                        {u.count}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${u.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Total Dokumen Terdistribusi:</span>
            <span className="font-bold text-emerald-400 font-mono">{stats.totalArsip} Arsip</span>
          </div>
        </div>

        {/* Kolom C:D (Baris 7-12) - JUMLAH PER TAHUN */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit',sans-serif]">
                  Jumlah Per Tahun
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-emerald-300 rounded border border-emerald-800/40">
                Kolom C:D (Baris 8-12)
              </span>
            </div>

            <div className="space-y-2">
              {standardYears.map((yr) => {
                const count = stats.perTahun[Number(yr)] || 0;
                const percentage = stats.totalArsip > 0 ? Math.round((count / stats.totalArsip) * 100) : 0;
                return (
                  <div key={yr} className="p-2.5 bg-slate-900/70 border border-slate-700/60 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 w-6">[{yearCells[yr]}]</span>
                      <span className="text-xs font-semibold text-slate-200">Tahun {yr}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400">{percentage}%</span>
                      <span className="font-mono font-bold text-emerald-400 px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-xs">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-400">Target kelulusan 5 tahun terakhir (2022-2026)</span>
          </div>
        </div>

        {/* Kolom E:F (Baris 7-12) - INTEGRITAS & KELENGKAPAN */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit',sans-serif]">
                  Integritas & Kelengkapan
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-purple-300 rounded border border-purple-800/40">
                Kolom E:F (Baris 8-12)
              </span>
            </div>

            <div className="space-y-2">
              {/* F8: LENGKAP */}
              <div className="p-2.5 bg-slate-900/70 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 w-6">[F8]</span>
                  <span className="text-xs font-semibold text-emerald-300">LENGKAP</span>
                </div>
                <span className="font-mono font-bold text-emerald-300 px-2 py-0.5 bg-slate-800 rounded border border-emerald-600/40 text-xs">
                  {stats.totalBerkasLengkap}
                </span>
              </div>

              {/* F9: BELUM LENGKAP */}
              <div className="p-2.5 bg-slate-900/70 border border-purple-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 w-6">[F9]</span>
                  <span className="text-xs font-semibold text-purple-300">BELUM LENGKAP</span>
                </div>
                <span className="font-mono font-bold text-purple-300 px-2 py-0.5 bg-slate-800 rounded border border-purple-600/40 text-xs">
                  {stats.totalBelumLengkap}
                </span>
              </div>

              {/* F10: Persentase Kelengkapan */}
              <div className="p-2.5 bg-slate-900/70 border border-slate-700/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 w-6">[F10]</span>
                  <span className="text-xs text-slate-300">Persentase Kelengkapan</span>
                </div>
                <span className="font-mono font-bold text-amber-400 px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-xs">
                  {stats.persentaseKelengkapan}%
                </span>
              </div>

              {/* F11: Persentase Verifikasi */}
              <div className="p-2.5 bg-slate-900/70 border border-slate-700/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 w-6">[F11]</span>
                  <span className="text-xs text-slate-300">Persentase Verifikasi</span>
                </div>
                <span className="font-mono font-bold text-blue-400 px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-xs">
                  {stats.persentaseVerifikasi}%
                </span>
              </div>

              {/* F12: DIBATALKAN */}
              <div className="p-2.5 bg-slate-900/70 border border-rose-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 w-6">[F12]</span>
                  <span className="text-xs font-semibold text-rose-300">DIBATALKAN (Soft Delete)</span>
                </div>
                <span className="font-mono font-bold text-rose-400 px-2 py-0.5 bg-slate-800 rounded border border-rose-600/40 text-xs">
                  {stats.totalDibatalkan}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Indeks Integritas Data:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              100% Sinkron Backend
            </span>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table Preview */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white font-['Outfit',sans-serif]">
              Arsip Ijazah Terbaru
            </h2>
            <p className="text-xs text-slate-400">
              Sinkronisasi realtime dari formulir pengajuan via Apps Script trigger ke 01_DATABASE_IJAZAH
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('database')}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition self-start sm:self-auto flex items-center space-x-1"
          >
            <span>Lihat Seluruh Database ({stats.totalArsip})</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700">
              <tr>
                <th className="px-3 py-2.5">No. Arsip</th>
                <th className="px-3 py-2.5">Nama Peserta Didik</th>
                <th className="px-3 py-2.5">NISN</th>
                <th className="px-3 py-2.5">Unit / Lulus</th>
                <th className="px-3 py-2.5">Kelengkapan</th>
                <th className="px-3 py-2.5">Status Verifikasi</th>
                <th className="px-3 py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {recentRecords.slice(0, 5).map((r) => {
                let badgeClass = 'bg-slate-700/80 text-slate-200 border border-slate-600';
                if (r.statusVerifikasi === 'TERVERIFIKASI') badgeClass = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
                else if (r.statusVerifikasi === 'BELUM DIVERIFIKASI') badgeClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
                else if (r.statusVerifikasi === 'PERLU PERBAIKAN') badgeClass = 'bg-orange-500/20 text-orange-300 border border-orange-500/40';
                else if (r.statusVerifikasi === 'DOKUMEN TIDAK SESUAI') badgeClass = 'bg-rose-500/20 text-rose-300 border border-rose-500/40';

                return (
                  <tr key={r.idRecord} className="hover:bg-slate-700/40 transition">
                    <td className="px-3 py-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {r.nomorArsip}
                    </td>
                    <td className="px-3 py-3 font-medium text-white max-w-[180px] truncate">
                      {r.namaLengkap}
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-400">
                      {r.nisn}
                    </td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 font-semibold text-[11px] border border-slate-700">
                        {r.unit} {r.tahunLulus}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.statusKelengkapan === 'LENGKAP' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}>
                        {r.statusKelengkapan}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${badgeClass}`}>
                        {r.statusVerifikasi}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => onSelectRecord(r)}
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition"
                      >
                        Detail & Bukti
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

