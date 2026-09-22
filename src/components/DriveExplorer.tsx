import React, { useState } from 'react';
import { ArchiveRecord } from '../types/archive';
import { 
  FolderTree, 
  Folder, 
  FolderOpen, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  HardDrive, 
  Download, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface DriveExplorerProps {
  records: ArchiveRecord[];
  onSelectRecord: (record: ArchiveRecord) => void;
}

export const DriveExplorer: React.FC<DriveExplorerProps> = ({
  records,
  onSelectRecord
}) => {
  // Extract years (including base archive years down to 2023)
  const recordYears = records.map(r => r.tahunLulus);
  const baseYears = [2026, 2025, 2024, 2023];
  const years = Array.from(new Set([...recordYears, ...baseYears])).sort((a, b) => b - a);
  const units = ['SD', 'SMP', 'SMA', 'PKBM'];

  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({
    [years[0] || 2026]: true
  });
  const [selectedFolder, setSelectedFolder] = useState<{ year: number; unit: string }>({
    year: years[0] || 2026,
    unit: 'SMP'
  });

  const toggleYear = (year: number) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  // Get records in selected folder
  const currentFolderRecords = records.filter(
    r => r.tahunLulus === selectedFolder.year && r.unit === selectedFolder.unit
  );

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <FolderTree className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-extrabold text-white font-['Outfit',sans-serif]">
              Struktur Folder Google Drive Terotomatisasi
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Organisasi berkas otomatis berdasarkan Tahun Kelulusan → Unit Satuan Pendidikan dengan standarisasi nama file
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-mono flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Akses Terbatas: Hanya Admin & Lembaga</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Folder Hierarchy Tree */}
        <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-700">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>ARSIP IJAZAH DIGITAL (ROOT)</span>
          </div>

          <div className="space-y-1 max-h-[560px] overflow-y-auto text-xs">
            {/* Backup Folder */}
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50 flex items-center space-x-2 text-slate-400">
              <Folder className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-[11px]">_BACKUP_DATABASE/</span>
            </div>

            {/* Year Folders */}
            {years.map((yr) => {
              const isYearExpanded = !!expandedYears[yr];
              return (
                <div key={yr} className="space-y-1">
                  <div
                    onClick={() => toggleYear(yr)}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 hover:bg-slate-750 cursor-pointer border border-slate-700/60 text-slate-200 transition"
                  >
                    <div className="flex items-center space-x-2">
                      {isYearExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      {isYearExpanded ? (
                        <FolderOpen className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Folder className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className="font-bold text-white">Tahun {yr}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-800 rounded">
                      {records.filter(r => r.tahunLulus === yr).length} Berkas
                    </span>
                  </div>

                  {/* Subfolders Unit */}
                  {isYearExpanded && (
                    <div className="pl-6 space-y-1 border-l-2 border-slate-700/60 ml-3 py-1">
                      {units.map((un) => {
                        const isSelected = selectedFolder.year === yr && selectedFolder.unit === un;
                        const count = records.filter(r => r.tahunLulus === yr && r.unit === un).length;
                        return (
                          <div
                            key={un}
                            onClick={() => setSelectedFolder({ year: yr, unit: un })}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                              isSelected
                                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-semibold shadow-sm'
                                : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                              <span>{un}</span>
                            </div>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: File List in Selected Folder */}
        <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-white font-mono">
                  ARSIP IJAZAH DIGITAL / {selectedFolder.year} / {selectedFolder.unit}
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Daftar file yang otomatis direname sesuai format: <code className="text-emerald-300 font-mono">[NOMOR_ARSIP]_[JENIS]_[NAMA]</code>
              </p>
            </div>

            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-semibold">
              {currentFolderRecords.length} Arsip Siswa
            </span>
          </div>

          {/* List of Files */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {currentFolderRecords.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Folder className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p>Belum ada file tersimpan di folder ini.</p>
              </div>
            ) : (
              currentFolderRecords.map((r) => {
                const cleanName = r.namaLengkap.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, 30);
                const fileDepan = `${r.nomorArsip}_DEPAN_${cleanName}.pdf`;
                const fileBelakang = `${r.nomorArsip}_BELAKANG_${cleanName}.pdf`;

                return (
                  <div
                    key={r.idRecord}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 space-y-2.5 transition"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-emerald-400">{r.nomorArsip}</span>
                        <h3 className="font-semibold text-white text-sm">{r.namaLengkap}</h3>
                      </div>
                      <button
                        onClick={() => onSelectRecord(r)}
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-500/30"
                      >
                        Lihat Data
                      </button>
                    </div>

                    {/* Virtual files inside this archive folder */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-800 text-xs font-mono">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                        <div className="flex items-center space-x-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate">{fileDepan}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 shrink-0 font-sans font-semibold">Tersimpan</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                        <div className="flex items-center space-x-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span className="truncate">{fileBelakang}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 shrink-0 font-sans font-semibold">Tersimpan</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
