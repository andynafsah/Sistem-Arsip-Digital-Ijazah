import React from 'react';
import { ArchiveRecord } from '../types/archive';
import { 
  X, 
  Printer, 
  School, 
  FileText, 
  User, 
  QrCode,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileWarning
} from 'lucide-react';

interface CertificateDetailModalProps {
  record: ArchiveRecord | null;
  onClose: () => void;
  onPrint: () => void;
}

export const CertificateDetailModal: React.FC<CertificateDetailModalProps> = ({
  record,
  onClose,
  onPrint
}) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <School className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm text-white font-['Outfit',sans-serif]">
              Bukti Arsip Digital Ijazah
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onPrint}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition flex items-center space-x-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Slip Tanda Terima</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voucher / Document View */}
        <div id="printable-slip" className="p-6 sm:p-8 space-y-6 text-slate-200 text-xs bg-slate-900">
          
          {/* Institutional Kop Surat */}
          <div className="text-center pb-4 border-b-2 border-emerald-500/60 space-y-1">
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              YAYASAN DARUL HADITS LIMA PULUH KOTA
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-wide font-['Outfit',sans-serif]">
              MA’HAD DARUL HADITS LIMA PULUH KOTA
            </h1>
            <p className="text-[11px] text-slate-400 max-w-lg mx-auto">
              Jl. Tan Malaka, Kab. Lima Puluh Kota, Sumatera Barat | Email: admin.arsip@darulhadits50kota.sch.id
            </p>
            <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
              TANDA TERIMA REGISTRASI ARSIP DIGITAL IJAZAH
            </div>
          </div>

          {/* Archive Barcode / Registration Number */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Nomor Registrasi Arsip:
              </span>
              <div className="text-xl sm:text-2xl font-mono font-black text-emerald-400 tracking-wider">
                {record.nomorArsip}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                ID Record: {record.idRecord} • Waktu: {record.timestamp}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  record.statusKelengkapan === 'LENGKAP'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/40'
                    : 'bg-purple-950 text-purple-300 border border-purple-700/40'
                }`}>
                  {record.statusKelengkapan}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  record.statusArsip === 'AKTIF'
                    ? 'bg-slate-800 text-slate-300'
                    : record.statusArsip === 'DIARSIPKAN'
                    ? 'bg-blue-950 text-blue-300'
                    : 'bg-rose-950 text-rose-300 line-through'
                }`}>
                  ARSIP: {record.statusArsip}
                </span>
              </div>
            </div>

            {/* Simulated QR Code Verification Stamp */}
            <div className="flex items-center space-x-2.5 p-2 bg-slate-900 border border-slate-700 rounded-lg shrink-0">
              <div className="w-12 h-12 bg-white rounded p-1 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-950" />
              </div>
              <div className="text-[10px] text-slate-300">
                <div className="font-bold text-emerald-400">{record.statusVerifikasi}</div>
                <div>Unit: {record.unit} {record.tahunLulus}</div>
                <div className="text-slate-400 text-[9px]">Verifikator: {record.verifiedBy || '-'}</div>
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="space-y-4">
            <h2 className="font-bold text-slate-300 border-b border-slate-800 pb-1 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Identitas Peserta Didik & Kelulusan</span>
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">Nama Lengkap:</div>
                <div className="font-bold text-white text-sm">{record.namaLengkap}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">NISN / NIS:</div>
                <div className="font-mono text-white">{record.nisn} / {record.nis || '-'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">Tempat, Tanggal Lahir:</div>
                <div className="text-white">{record.tempatLahir}, {record.tanggalLahir}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">Jenis Kelamin / Unit:</div>
                <div className="text-white">{record.jenisKelamin} ({record.unit} - Lulus {record.tahunLulus})</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">Orang Tua / Wali:</div>
                <div className="text-white">{record.namaAyahWali} / {record.namaIbuWali}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">No. WhatsApp:</div>
                <div className="font-mono text-emerald-400">{record.nomorWhatsapp}</div>
              </div>
            </div>
          </div>

          {/* Diploma Details */}
          <div className="space-y-4 pt-2">
            <h2 className="font-bold text-slate-300 border-b border-slate-800 pb-1 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Data Ijazah & Berkas Pendukung</span>
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">Nomor Seri Ijazah:</div>
                <div className="font-mono font-bold text-amber-300">{record.nomorIjazah}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">Tgl Terbit / Tahun Ijazah:</div>
                <div className="text-white">{record.tanggalTerbitIjazah} (Tahun {record.tahunIjazah})</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">Kondisi Fisik Dokumen:</div>
                <div className="text-white">{record.statusDokumen}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400 text-[11px]">Penyimpanan Google Drive:</div>
                <div className="font-mono text-emerald-400 truncate">{record.folderArsip}</div>
              </div>
            </div>

            {record.catatanVerifikasi && (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[11px] font-semibold mb-0.5">Catatan Verifikator:</span>
                <p className="text-slate-200">{record.catatanVerifikasi}</p>
              </div>
            )}
          </div>

          {/* Signatures & Notes */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div>
              <p>Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-[10px] text-slate-500">Sistem Arsip Digital Ma'had Darul Hadits Lima Puluh Kota</p>
            </div>
            <div className="text-right">
              <p>Petugas Administrator Arsip,</p>
              <div className="font-bold text-white mt-4">{record.verifiedBy && record.verifiedBy !== '-' ? record.verifiedBy : 'Tim Arsip Digital'}</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
