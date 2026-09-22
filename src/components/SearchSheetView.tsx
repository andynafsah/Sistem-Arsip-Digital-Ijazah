import React, { useState, useMemo } from 'react';
import { ArchiveRecord } from '../types/archive';
import { 
  Search, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  HelpCircle,
  FileCheck,
  Eye,
  Printer
} from 'lucide-react';

interface SearchSheetViewProps {
  records: ArchiveRecord[];
  onSelectRecord: (record: ArchiveRecord) => void;
  onPrintSlip: (record: ArchiveRecord) => void;
}

export const SearchSheetView: React.FC<SearchSheetViewProps> = ({
  records,
  onSelectRecord,
  onPrintSlip
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('ALL');

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q && selectedUnit === 'ALL') {
      return records.filter(r => r.statusArsip !== 'DIBATALKAN');
    }

    return records.filter(r => {
      // Exclude DIBATALKAN by default unless searching explicitly
      if (r.statusArsip === 'DIBATALKAN' && !q.includes('batal')) return false;

      const matchQuery = !q || (
        r.namaLengkap.toLowerCase().includes(q) ||
        r.nisn.includes(q) ||
        r.nis.includes(q) ||
        r.nomorIjazah.toLowerCase().includes(q) ||
        r.nomorArsip.toLowerCase().includes(q)
      );

      const matchUnit = selectedUnit === 'ALL' || r.unit === selectedUnit;
      return matchQuery && matchUnit;
    });
  }, [records, searchQuery, selectedUnit]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Search className="w-4 h-4" />
              <span>Simulasi Sheet: 05_PENCARIAN</span>
            </div>
            <h1 className="text-xl font-extrabold text-white font-['Outfit',sans-serif]">
              Pencarian Cepat Dokumen Ijazah (Staf Non-Teknis)
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Cukup ketikkan salah satu data: <strong>NISN</strong>, <strong>Nama Siswa</strong>, <strong>Nomor Ijazah</strong>, atau <strong>Nomor Registrasi Arsip</strong>. Hasil seketika muncul lengkap dengan tautan berkas asli Google Drive.
            </p>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-600/50 rounded-xl text-xs font-bold">
              {filteredResults.length} Ditemukan
            </span>
          </div>
        </div>
      </div>

      {/* Input Cell Box mimicking Google Sheet Search Cell */}
      <div className="bg-slate-800/90 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cell Input Pencarian (B3 di Spreadsheet 05_PENCARIAN):</span>
          </label>
          <span className="text-[11px] text-slate-400">Tekan ESC atau hapus teks untuk reset</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-emerald-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik NISN (10 digit), Nama Alumni, atau No Ijazah..."
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              autoFocus
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full py-3 px-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Unit</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="PKBM">PKBM</option>
            </select>
          </div>
        </div>

        {/* Quick hint buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
          <span>Contoh cepat:</span>
          <button 
            onClick={() => setSearchQuery('Muhammad Fathurrahman')}
            className="px-2.5 py-0.5 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px]"
          >
            Fathurrahman
          </button>
          <button 
            onClick={() => setSearchQuery('0059876543')}
            className="px-2.5 py-0.5 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] font-mono"
          >
            NISN 0059876543
          </button>
          <button 
            onClick={() => setSearchQuery('IJZ-2026-SMP-0001')}
            className="px-2.5 py-0.5 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[11px] font-mono"
          >
            IJZ-2026-SMP-0001
          </button>
        </div>
      </div>

      {/* Results Table (Strictly 7 Fields of Phase 2 Section 2) */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-700 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">
            Hasil Ekstraksi Otomatis (FILTER / QUERY Spreadsheet)
          </span>
          <span className="text-xs text-slate-500">
            Tampil 7 Kolom Utama
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Nomor Arsip</th>
                <th className="px-4 py-3">Nama Peserta Didik</th>
                <th className="px-4 py-3">NISN / No Ijazah</th>
                <th className="px-4 py-3">Unit & Tahun</th>
                <th className="px-4 py-3">Status Verifikasi</th>
                <th className="px-4 py-3">Link File Depan</th>
                <th className="px-4 py-3">Link File Belakang</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">
                      Tidak ada arsip yang cocok dengan pencarian "{searchQuery}"
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Periksa ejaan nama, angka NISN, atau ganti filter satuan pendidikan.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredResults.map((r) => {
                  let badge = 'bg-slate-800 text-slate-300';
                  if (r.statusVerifikasi === 'TERVERIFIKASI') badge = 'bg-emerald-950 text-emerald-300 border border-emerald-600/40';
                  else if (r.statusVerifikasi === 'BELUM DIVERIFIKASI') badge = 'bg-amber-950 text-amber-300 border border-amber-600/40';
                  else if (r.statusVerifikasi === 'PERLU PERBAIKAN') badge = 'bg-rose-950 text-rose-300 border border-rose-600/40';
                  else if (r.statusVerifikasi === 'DOKUMEN TIDAK SESUAI') badge = 'bg-slate-800 text-slate-400 border border-slate-600/40';

                  return (
                    <tr key={r.idRecord} className="hover:bg-slate-750/70 transition">
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {r.nomorArsip}
                      </td>
                      <td className="px-4 py-3 font-semibold text-white">
                        <div>{r.namaLengkap}</div>
                        <div className="text-[10px] text-slate-400 font-normal">TTL: {r.tempatLahir}, {r.tanggalLahir}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-300">
                        <div>{r.nisn}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{r.nomorIjazah}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-semibold border border-slate-700">
                          {r.unit} {r.tahunLulus}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${badge}`}>
                          {r.statusVerifikasi}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {r.fileIjazahDepan ? (
                          <a
                            href={r.fileIjazahDepan}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium"
                          >
                            <span>Buka Depan</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {r.fileIjazahBelakang ? (
                          <a
                            href={r.fileIjazahBelakang}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-teal-400 hover:text-teal-300 font-medium"
                          >
                            <span>Buka Belakang</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => onSelectRecord(r)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition border border-slate-700 flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>Detail</span>
                          </button>
                          <button
                            onClick={() => onPrintSlip(r)}
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded-lg text-xs font-semibold transition border border-emerald-500/30 flex items-center space-x-1"
                          >
                            <Printer className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Slip</span>
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
    </div>
  );
};
