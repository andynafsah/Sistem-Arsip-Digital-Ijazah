import React, { useState } from 'react';
import { ArchiveRecord, StatusVerifikasi } from '../types/archive';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  UserCheck, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  FileSearch,
  MessageSquareQuote,
  Clock
} from 'lucide-react';

interface VerificationDeskProps {
  records: ArchiveRecord[];
  onUpdateStatus: (
    recordId: string, 
    newStatus: StatusVerifikasi, 
    verifierName: string, 
    notes: string
  ) => void;
}

export const VerificationDesk: React.FC<VerificationDeskProps> = ({
  records,
  onUpdateStatus
}) => {
  const pendingRecords = records.filter(
    r => r.statusVerifikasi === 'BELUM DIVERIFIKASI' || 
         r.statusVerifikasi === 'PERLU PERBAIKAN'
  );

  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    pendingRecords[0]?.idRecord || records[0]?.idRecord || ''
  );
  const [verifierName, setVerifierName] = useState<string>('Muhammad Andy');
  const [notes, setNotes] = useState<string>('');
  const [activeImageTab, setActiveImageTab] = useState<'depan' | 'belakang' | 'pendukung'>('depan');

  const activeRecord = records.find(r => r.idRecord === selectedRecordId) || records[0];

  const handleApplyVerification = (status: StatusVerifikasi) => {
    if (!activeRecord) return;
    onUpdateStatus(activeRecord.idRecord, status, verifierName, notes);
    setNotes('');
  };

  if (!activeRecord) {
    return (
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-12 text-center text-slate-400">
        <FileSearch className="w-12 h-12 mx-auto text-slate-500 mb-3" />
        <h3 className="text-base font-bold text-white">Tidak ada data arsip untuk diverifikasi</h3>
        <p className="text-xs text-slate-400 mt-1">Semua dokumen telah diproses atau belum ada submission.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Desk */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-extrabold text-white font-['Outfit',sans-serif]">
              Meja Verifikasi & Validasi Keabsahan Ijazah
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pemeriksaan scan fisik, nomor seri nasional, dan konfirmasi legalitas dokumen peserta didik
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-600/50 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingRecords.length} Menunggu Tindakan</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Pending Records */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Daftar Antrean Verifikasi ({records.length})
          </h2>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {records.map((r) => {
              const isSelected = r.idRecord === activeRecord.idRecord;
              let badgeColor = 'bg-slate-800 text-slate-300';
              if (r.statusVerifikasi === 'TERVERIFIKASI') badgeColor = 'bg-emerald-950 text-emerald-400 border-emerald-700/40';
              else if (r.statusVerifikasi === 'BELUM DIVERIFIKASI') badgeColor = 'bg-amber-950 text-amber-400 border-amber-700/40';
              else if (r.statusVerifikasi === 'PERLU PERBAIKAN') badgeColor = 'bg-rose-950 text-rose-400 border-rose-700/40';
              else if (r.statusVerifikasi === 'DOKUMEN TIDAK SESUAI') badgeColor = 'bg-slate-800 text-slate-400 border-slate-600/40';

              return (
                <div
                  key={r.idRecord}
                  onClick={() => {
                    setSelectedRecordId(r.idRecord);
                    setNotes(r.catatanVerifikasi || '');
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition text-xs ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/80 border-slate-700 hover:border-slate-600 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-emerald-400">{r.nomorArsip}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                      {r.statusVerifikasi}
                    </span>
                  </div>
                  <div className="font-semibold text-white truncate text-sm">{r.namaLengkap}</div>
                  <div className="text-slate-400 mt-1 flex items-center justify-between text-[11px]">
                    <span>{r.unit} • Lulus {r.tahunLulus}</span>
                    <span className="font-mono text-slate-400">NISN: {r.nisn}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Record Detail & Inspection Canvas */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Record Information Card */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-sm">
            {/* Warning if Duplicate */}
            {(activeRecord.isDuplicateWarning || activeRecord.catatanVerifikasi?.includes('PERINGATAN')) && (
              <div className="mb-4 p-3.5 rounded-xl bg-purple-950/80 border border-purple-600/50 text-purple-200 text-xs flex items-start space-x-2.5">
                <Copy className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Peringatan Duplikasi Data Terdeteksi</div>
                  <p className="mt-0.5 text-purple-300">
                    {activeRecord.catatanVerifikasi || 'Data NISN terindikasi sudah pernah terdaftar sebelumnya di database.'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400">{activeRecord.nomorArsip}</span>
                <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                  {activeRecord.namaLengkap}
                </h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  ID Record: <span className="font-mono text-slate-300">{activeRecord.idRecord}</span> • Waktu Masuk: {activeRecord.timestamp}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Status Saat Ini:</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-slate-900 border border-slate-700 text-emerald-400">
                  {activeRecord.statusVerifikasi}
                </span>
              </div>
            </div>

            {/* Metadata Fields Comparison */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-900/70 p-3.5 rounded-xl border border-slate-700/60 mb-4">
              <div>
                <span className="text-slate-400 block text-[11px]">NISN</span>
                <span className="font-mono font-semibold text-white">{activeRecord.nisn}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">NIS / No. Induk</span>
                <span className="font-mono text-white">{activeRecord.nis || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Unit Pendidikan</span>
                <span className="font-semibold text-emerald-300">{activeRecord.unit}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tahun Lulus</span>
                <span className="font-semibold text-white">{activeRecord.tahunLulus}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Nomor Ijazah</span>
                <span className="font-mono font-bold text-amber-300 truncate block">{activeRecord.nomorIjazah}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tgl Terbit Ijazah</span>
                <span className="text-white">{activeRecord.tanggalTerbitIjazah || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Kondisi Fisik</span>
                <span className="text-white">{activeRecord.statusDokumen}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">No. WhatsApp</span>
                <span className="font-mono text-white">{activeRecord.nomorWhatsapp}</span>
              </div>
            </div>

            {/* Document Scan Viewer Tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-xs font-bold text-slate-300">Pratinjau Berkas Scan Ijazah:</span>
                <div className="flex space-x-1 text-xs">
                  <button
                    onClick={() => setActiveImageTab('depan')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      activeImageTab === 'depan' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Ijazah Depan
                  </button>
                  <button
                    onClick={() => setActiveImageTab('belakang')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      activeImageTab === 'belakang' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Halaman Belakang / Nilai
                  </button>
                  {activeRecord.filePendukung && (
                    <button
                      onClick={() => setActiveImageTab('pendukung')}
                      className={`px-3 py-1 rounded-lg font-medium transition ${
                        activeImageTab === 'pendukung' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Pendukung
                    </button>
                  )}
                </div>
              </div>

              {/* Document Display Box */}
              <div className="relative bg-slate-950 rounded-xl border border-slate-700/80 p-4 flex flex-col items-center justify-center min-h-[280px]">
                {activeImageTab === 'depan' && (
                  <div className="w-full text-center">
                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 mb-3 flex items-center justify-between">
                      <span className="font-mono text-emerald-400">
                        File Drive: {activeRecord.nomorArsip}_DEPAN_{activeRecord.namaLengkap.replace(/\s+/g, '_')}.pdf
                      </span>
                      <span className="text-slate-400">Resolusi Tinggi</span>
                    </div>
                    <img
                      src={activeRecord.fileIjazahDepan || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"}
                      alt="Scan Ijazah Depan"
                      className="max-h-[300px] mx-auto rounded-lg shadow-lg border border-slate-700 object-contain"
                    />
                  </div>
                )}

                {activeImageTab === 'belakang' && (
                  <div className="w-full text-center">
                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 mb-3 flex items-center justify-between">
                      <span className="font-mono text-emerald-400">
                        File Drive: {activeRecord.nomorArsip}_BELAKANG_{activeRecord.namaLengkap.replace(/\s+/g, '_')}.pdf
                      </span>
                      <span className="text-slate-400">Daftar Nilai / Transkrip</span>
                    </div>
                    <img
                      src={activeRecord.fileIjazahBelakang || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"}
                      alt="Scan Ijazah Belakang"
                      className="max-h-[300px] mx-auto rounded-lg shadow-lg border border-slate-700 object-contain"
                    />
                  </div>
                )}

                {activeImageTab === 'pendukung' && activeRecord.filePendukung && (
                  <div className="w-full text-center">
                    <img
                      src={activeRecord.filePendukung}
                      alt="Dokumen Pendukung"
                      className="max-h-[300px] mx-auto rounded-lg shadow-lg border border-slate-700 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Verification Form & Actions */}
            <div className="mt-5 pt-4 border-t border-slate-700 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nama Petugas Verifikator:</label>
                  <input
                    type="text"
                    value={verifierName}
                    onChange={(e) => setVerifierName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Nama Admin / Verifikator"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Catatan Verifikasi / Alasan:</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Contoh: Dokumen autentik, nomor seri sah sesuai buku induk..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleApplyVerification('PERLU PERBAIKAN')}
                  className="px-4 py-2 text-xs font-semibold bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700/50 rounded-xl transition flex items-center space-x-1.5"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Minta Perbaikan Scan</span>
                </button>

                <button
                  onClick={() => handleApplyVerification('DOKUMEN TIDAK SESUAI')}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded-xl transition flex items-center space-x-1.5"
                >
                  <XCircle className="w-4 h-4 text-slate-400" />
                  <span>Tolak (Tidak Sesuai)</span>
                </button>

                <button
                  onClick={() => handleApplyVerification('TERVERIFIKASI')}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-950/40 transition flex items-center space-x-2 transform active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Sahkan & Verifikasi Arsip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
