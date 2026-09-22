import React, { useState, useMemo } from 'react';
import { ArchiveRecord, UnitType, StatusVerifikasi, StatusArsip, StatusKelengkapan } from '../types/archive';
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Printer,
  Eye,
  FileSpreadsheet,
  Ban,
  FileWarning
} from 'lucide-react';

interface DatabaseTableProps {
  records: ArchiveRecord[];
  onSelectRecord: (record: ArchiveRecord) => void;
  onOpenVerifyModal: (record: ArchiveRecord) => void;
  onPrintSlip: (record: ArchiveRecord) => void;
  onCancelArchive?: (recordId: string, reason: string) => void;
}

export const DatabaseTable: React.FC<DatabaseTableProps> = ({
  records,
  onSelectRecord,
  onOpenVerifyModal,
  onPrintSlip,
  onCancelArchive
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedArsipStatus, setSelectedArsipStatus] = useState<string>('ALL');
  const [selectedKelengkapan, setSelectedKelengkapan] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'standard' | 'full31'>('standard');

  // Cancel Archive Prompt State
  const [cancellingRecord, setCancellingRecord] = useState<ArchiveRecord | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');

  // Extract unique graduation years (including base archive years down to 2023)
  const availableYears = useMemo(() => {
    const recordYears = records.map(r => r.tahunLulus);
    const baseYears = [2026, 2025, 2024, 2023];
    const years = Array.from(new Set([...recordYears, ...baseYears])).sort((a, b) => b - a);
    return years;
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Search term
      const q = searchTerm.toLowerCase();
      const matchQuery = 
        !searchTerm ||
        r.namaLengkap.toLowerCase().includes(q) ||
        r.nomorArsip.toLowerCase().includes(q) ||
        r.nisn.includes(q) ||
        r.nis.includes(q) ||
        r.nomorIjazah.toLowerCase().includes(q) ||
        r.idRecord.toLowerCase().includes(q);

      // Filters
      const matchUnit = selectedUnit === 'ALL' || r.unit === selectedUnit;
      const matchYear = selectedYear === 'ALL' || r.tahunLulus.toString() === selectedYear;
      const matchStatus = selectedStatus === 'ALL' || r.statusVerifikasi === selectedStatus;
      const matchArsipStatus = selectedArsipStatus === 'ALL' || r.statusArsip === selectedArsipStatus;
      const matchKelengkapan = selectedKelengkapan === 'ALL' || r.statusKelengkapan === selectedKelengkapan;

      return matchQuery && matchUnit && matchYear && matchStatus && matchArsipStatus && matchKelengkapan;
    });
  }, [records, searchTerm, selectedUnit, selectedYear, selectedStatus, selectedArsipStatus, selectedKelengkapan]);

  // Confirm soft delete
  const handleConfirmCancel = () => {
    if (!cancellingRecord || !onCancelArchive) return;
    onCancelArchive(cancellingRecord.idRecord, cancelReason || 'Dibatalkan oleh petugas administrasi');
    setCancellingRecord(null);
    setCancelReason('');
  };

  // Export to CSV (31 Columns)
  const handleExportCSV = () => {
    const headers = [
      "ID_RECORD", "NOMOR_ARSIP", "TIMESTAMP", "NAMA_LENGKAP", "NISN", "NIS", 
      "TEMPAT_LAHIR", "TANGGAL_LAHIR", "JENIS_KELAMIN", "UNIT", "TAHUN_LULUS", 
      "NAMA_AYAH_WALI", "NAMA_IBU_WALI", "NOMOR_WHATSAPP", "ALAMAT", "NOMOR_IJAZAH", 
      "TANGGAL_TERBIT_IJAZAH", "TAHUN_IJAZAH", "NOMOR_UJIAN", "STATUS_DOKUMEN", 
      "FILE_IJAZAH_DEPAN", "FILE_IJAZAH_BELAKANG", "FILE_PENDUKUNG", "FOLDER_ARSIP", 
      "STATUS_KELENGKAPAN", "STATUS_VERIFIKASI", "VERIFIED_BY", "VERIFIED_AT", "CATATAN_VERIFIKASI", 
      "STATUS_ARSIP", "LAST_UPDATED"
    ];

    const rows = filteredRecords.map(r => [
      `"${r.idRecord}"`, `"${r.nomorArsip}"`, `"${r.timestamp}"`, `"${r.namaLengkap}"`,
      `"${r.nisn}"`, `"${r.nis}"`, `"${r.tempatLahir}"`, `"${r.tanggalLahir}"`,
      `"${r.jenisKelamin}"`, `"${r.unit}"`, r.tahunLulus, `"${r.namaAyahWali}"`,
      `"${r.namaIbuWali}"`, `"${r.nomorWhatsapp}"`, `"${r.alamat.replace(/"/g, '""')}"`,
      `"${r.nomorIjazah}"`, `"${r.tanggalTerbitIjazah}"`, r.tahunIjazah,
      `"${r.nomorUjian || '-'}"`, `"${r.statusDokumen}"`, `"${r.fileIjazahDepan}"`,
      `"${r.fileIjazahBelakang}"`, `"${r.filePendukung || '-'}"`, `"${r.folderArsip}"`,
      `"${r.statusKelengkapan}"`, `"${r.statusVerifikasi}"`, `"${r.verifiedBy || '-'}"`, `"${r.verifiedAt || '-'}"`,
      `"${(r.catatanVerifikasi || '').replace(/"/g, '""')}"`, `"${r.statusArsip}"`,
      `"${r.lastUpdated}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DATABASE_ARSIP_IJAZAH_31_KOLOM_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header Controls & Metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-extrabold text-white font-['Outfit',sans-serif]">
              Sheet: 01_DATABASE_IJAZAH
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-semibold border border-emerald-600/40">
              {filteredRecords.length} Record Ditampilkan
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Struktur master database 31 kolom terstandarisasi Ma'had Darul Hadits Lima Puluh Kota (Mendukung Soft Delete)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Switch Column View */}
          <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setViewMode('standard')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                viewMode === 'standard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tampilan Ringkas
            </button>
            <button
              onClick={() => setViewMode('full31')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                viewMode === 'full31'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              31 Kolom Spreadsheet
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-xl border border-slate-600 transition flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar (Phase 2 Section 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
        {/* Search Field */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari Nama, NISN, No. Ijazah, No. Arsip..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Unit */}
        <div>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="w-full px-2.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Unit</option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
            <option value="PKBM">PKBM</option>
          </select>
        </div>

        {/* Filter Tahun */}
        <div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-2.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Tahun</option>
            {availableYears.map(yr => (
              <option key={yr} value={yr}>Tahun {yr}</option>
            ))}
          </select>
        </div>

        {/* Filter Status Verifikasi */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-2.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Verifikasi</option>
            <option value="BELUM DIVERIFIKASI">Belum Diverifikasi</option>
            <option value="TERVERIFIKASI">Terverifikasi</option>
            <option value="PERLU PERBAIKAN">Perlu Perbaikan</option>
            <option value="DOKUMEN TIDAK SESUAI">Dokumen Tidak Sesuai</option>
          </select>
        </div>

        {/* Filter Status Arsip & Kelengkapan */}
        <div>
          <select
            value={selectedArsipStatus}
            onChange={(e) => setSelectedArsipStatus(e.target.value)}
            className="w-full px-2.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Status Arsip (Semua)</option>
            <option value="AKTIF">Status: AKTIF</option>
            <option value="DIARSIPKAN">Status: DIARSIPKAN</option>
            <option value="DIBATALKAN">Status: DIBATALKAN</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto max-h-[620px] relative">
          <table className="w-full text-left text-xs text-slate-200 border-collapse">
            <thead className="bg-slate-950 text-slate-300 uppercase font-semibold sticky top-0 z-20 border-b border-slate-700">
              <tr>
                <th className="px-3.5 py-3 border-r border-slate-800 text-center w-12">No</th>
                <th className="px-3.5 py-3 border-r border-slate-800 whitespace-nowrap">Nomor Arsip</th>
                <th className="px-3.5 py-3 border-r border-slate-800 whitespace-nowrap">Nama Peserta Didik</th>
                <th className="px-3.5 py-3 border-r border-slate-800 whitespace-nowrap">NISN / NIS</th>
                <th className="px-3.5 py-3 border-r border-slate-800 whitespace-nowrap">Unit & Lulus</th>
                <th className="px-3.5 py-3 border-r border-slate-800 whitespace-nowrap">Kelengkapan</th>
                <th className="px-3.5 py-3 border-r border-slate-800 whitespace-nowrap">Status Verifikasi</th>
                <th className="px-3.5 py-3 border-r border-slate-800 whitespace-nowrap">Status Arsip</th>
                
                {viewMode === 'full31' && (
                  <>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">ID_RECORD</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">TIMESTAMP</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">TTL</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">JK</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">NAMA AYAH</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">NAMA IBU</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">WHATSAPP</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">ALAMAT</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">NO IJAZAH</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">TGL TERBIT</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">TAHUN IJAZAH</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">NO UJIAN</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">STATUS DOKUMEN</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">FOLDER DRIVE</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">VERIFIED BY</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">VERIFIED AT</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">CATATAN</th>
                    <th className="px-3 py-3 border-r border-slate-800 whitespace-nowrap">LAST UPDATED</th>
                  </>
                )}

                <th className="px-3.5 py-3 text-center sticky right-0 bg-slate-950 z-30 shadow-l">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={viewMode === 'full31' ? 27 : 9} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">Tidak ada data arsip yang cocok.</p>
                    <p className="text-xs text-slate-500 mt-1">Coba ganti filter pencarian atau buat submission baru.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => {
                  const isCancelled = r.statusArsip === 'DIBATALKAN';

                  let badgeClass = 'bg-slate-700/80 text-slate-200 border border-slate-600';
                  if (r.statusVerifikasi === 'TERVERIFIKASI') badgeClass = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
                  else if (r.statusVerifikasi === 'BELUM DIVERIFIKASI') badgeClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
                  else if (r.statusVerifikasi === 'PERLU PERBAIKAN') badgeClass = 'bg-orange-500/20 text-orange-300 border border-orange-500/40';
                  else if (r.statusVerifikasi === 'DOKUMEN TIDAK SESUAI') badgeClass = 'bg-rose-500/20 text-rose-300 border border-rose-500/40';

                  let arsipBadge = 'bg-slate-800 text-slate-300 border border-slate-700';
                  if (r.statusArsip === 'AKTIF') arsipBadge = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
                  else if (r.statusArsip === 'DIARSIPKAN') arsipBadge = 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
                  else if (r.statusArsip === 'DIBATALKAN') arsipBadge = 'bg-rose-500/20 text-rose-300 border border-rose-500/40 line-through';

                  return (
                    <tr 
                      key={r.idRecord} 
                      className={`hover:bg-slate-750/70 transition ${isCancelled ? 'opacity-60 bg-slate-900/40' : ''}`}
                    >
                      <td className="px-3.5 py-3 text-center text-slate-400 border-r border-slate-800/80 font-mono">
                        {idx + 1}
                      </td>
                      <td className={`px-3.5 py-3 font-mono font-bold whitespace-nowrap border-r border-slate-800/80 ${isCancelled ? 'line-through text-slate-400' : 'text-emerald-400'}`}>
                        {r.nomorArsip}
                      </td>
                      <td className="px-3.5 py-3 font-medium text-white max-w-[190px] truncate border-r border-slate-800/80">
                        <div className={isCancelled ? 'line-through text-slate-400' : ''}>{r.namaLengkap}</div>
                      </td>
                      <td className="px-3.5 py-3 font-mono text-slate-300 whitespace-nowrap border-r border-slate-800/80">
                        <div>{r.nisn}</div>
                        <div className="text-[10px] text-slate-500">NIS: {r.nis || '-'}</div>
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap border-r border-slate-800/80">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-semibold text-[11px] border border-slate-700">
                          {r.unit} {r.tahunLulus}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap border-r border-slate-800/80">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.statusKelengkapan === 'LENGKAP' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50' 
                            : 'bg-purple-950 text-purple-300 border border-purple-700/50'
                        }`}>
                          {r.statusKelengkapan}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap border-r border-slate-800/80">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block ${badgeClass}`}>
                          {r.statusVerifikasi}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap border-r border-slate-800/80">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${arsipBadge}`}>
                          {r.statusArsip}
                        </span>
                      </td>

                      {/* Extended 31 Columns View */}
                      {viewMode === 'full31' && (
                        <>
                          <td className="px-3 py-3 font-mono text-slate-400 text-[11px] border-r border-slate-800/80">{r.idRecord}</td>
                          <td className="px-3 py-3 text-slate-400 text-[11px] border-r border-slate-800/80">{r.timestamp}</td>
                          <td className="px-3 py-3 text-slate-300 text-[11px] border-r border-slate-800/80">{r.tempatLahir}, {r.tanggalLahir}</td>
                          <td className="px-3 py-3 text-slate-300 text-[11px] border-r border-slate-800/80">{r.jenisKelamin}</td>
                          <td className="px-3 py-3 text-slate-300 text-[11px] border-r border-slate-800/80">{r.namaAyahWali}</td>
                          <td className="px-3 py-3 text-slate-300 text-[11px] border-r border-slate-800/80">{r.namaIbuWali}</td>
                          <td className="px-3 py-3 font-mono text-slate-300 text-[11px] border-r border-slate-800/80">{r.nomorWhatsapp}</td>
                          <td className="px-3 py-3 text-slate-400 text-[11px] max-w-[180px] truncate border-r border-slate-800/80">{r.alamat}</td>
                          <td className="px-3 py-3 font-mono text-slate-300 text-[11px] border-r border-slate-800/80">{r.nomorIjazah}</td>
                          <td className="px-3 py-3 text-slate-300 text-[11px] border-r border-slate-800/80">{r.tanggalTerbitIjazah}</td>
                          <td className="px-3 py-3 text-slate-300 text-[11px] border-r border-slate-800/80">{r.tahunIjazah}</td>
                          <td className="px-3 py-3 font-mono text-slate-400 text-[11px] border-r border-slate-800/80">{r.nomorUjian || '-'}</td>
                          <td className="px-3 py-3 text-slate-300 text-[11px] border-r border-slate-800/80">{r.statusDokumen}</td>
                          <td className="px-3 py-3 text-emerald-400 text-[11px] border-r border-slate-800/80 truncate max-w-[140px]">{r.folderArsip}</td>
                          <td className="px-3 py-3 text-slate-300 text-[11px] border-r border-slate-800/80">{r.verifiedBy || '-'}</td>
                          <td className="px-3 py-3 text-slate-400 text-[11px] border-r border-slate-800/80">{r.verifiedAt || '-'}</td>
                          <td className="px-3 py-3 text-slate-300 text-[11px] max-w-[160px] truncate border-r border-slate-800/80">{r.catatanVerifikasi || '-'}</td>
                          <td className="px-3 py-3 text-slate-400 text-[11px] border-r border-slate-800/80">{r.lastUpdated}</td>
                        </>
                      )}

                      {/* Action Cell */}
                      <td className="px-3.5 py-3 text-center sticky right-0 bg-slate-900/95 z-10 border-l border-slate-800">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => onSelectRecord(r)}
                            title="Lihat Detail & Scan Dokumen"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-300" />
                          </button>
                          
                          {!isCancelled && (
                            <>
                              <button
                                onClick={() => onOpenVerifyModal(r)}
                                title="Verifikasi Dokumen"
                                className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 transition border border-emerald-500/30"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              </button>
                              
                              {onCancelArchive && (
                                <button
                                  onClick={() => setCancellingRecord(r)}
                                  title="Batalkan Arsip (Soft Delete)"
                                  className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 transition border border-rose-800/50"
                                >
                                  <Ban className="w-3.5 h-3.5 text-rose-400" />
                                </button>
                              )}
                            </>
                          )}

                          <button
                            onClick={() => onPrintSlip(r)}
                            title="Cetak Bukti Tanda Terima Arsip"
                            className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 transition border border-blue-500/30"
                          >
                            <Printer className="w-3.5 h-3.5 text-blue-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Soft Delete Confirmation Modal (Phase 2 Section 6) */}
      {cancellingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <Ban className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">
                Batalkan Arsip (Soft Delete)
              </h3>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Anda akan menandai arsip <strong>{cancellingRecord.nomorArsip}</strong> ({cancellingRecord.namaLengkap}) sebagai <strong>DIBATALKAN</strong>. Baris data tidak dihapus permanen dari spreadsheet, melainkan dipertahankan demi jejak audit.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Alasan Pembatalan:
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Contoh: Terjadi kesalahan penginputan duplikat atau permohonan pembatalan oleh alumni..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setCancellingRecord(null)}
                className="px-3.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition shadow-md"
              >
                Konfirmasi Pembatalan Arsip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
