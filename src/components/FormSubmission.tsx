import React, { useState } from 'react';
import { ArchiveRecord, UnitType, StatusDokumen } from '../types/archive';
import { 
  generateArchiveNumber, 
  generateRecordId, 
  normalizeWhatsapp, 
  checkDuplicateRecord 
} from '../utils/archiveUtils';
import { 
  FilePlus2, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  School,
  User,
  ShieldCheck,
  Printer
} from 'lucide-react';

interface FormSubmissionProps {
  existingRecords: ArchiveRecord[];
  onNewSubmission: (newRecord: ArchiveRecord) => void;
  onPrintSlip: (record: ArchiveRecord) => void;
  webAppUrl?: string;
}

export const FormSubmission: React.FC<FormSubmissionProps> = ({
  existingRecords,
  onNewSubmission,
  onPrintSlip,
  webAppUrl
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submittedRecord, setSubmittedRecord] = useState<ArchiveRecord | null>(null);
  const [isSyncingGas, setIsSyncingGas] = useState(false);

  // Form Fields
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nisn, setNisn] = useState('');
  const [nis, setNis] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [unit, setUnit] = useState<UnitType>('SMP');
  const [tahunLulus, setTahunLulus] = useState<number>(new Date().getFullYear());

  // Parent Data
  const [namaAyahWali, setNamaAyahWali] = useState('');
  const [namaIbuWali, setNamaIbuWali] = useState('');
  const [nomorWhatsapp, setNomorWhatsapp] = useState('');
  const [alamat, setAlamat] = useState('');

  // Diploma Data
  const [nomorIjazah, setNomorIjazah] = useState('');
  const [tanggalTerbitIjazah, setTanggalTerbitIjazah] = useState('');
  const [tahunIjazah, setTahunIjazah] = useState<number>(new Date().getFullYear());
  const [nomorUjian, setNomorUjian] = useState('');
  const [statusDokumen, setStatusDokumen] = useState<StatusDokumen>('Ijazah asli tersedia');
  const [keteranganTambahan, setKeteranganTambahan] = useState('');

  // Files simulation
  const [fileDepanName, setFileDepanName] = useState('scan_ijazah_asli_depan.pdf');
  const [fileBelakangName, setFileBelakangName] = useState('scan_ijazah_daftar_nilai.pdf');
  const [filePendukungName, setFilePendukungName] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generate Year choices
  const currentYear = new Date().getFullYear();
  const yearOptions: number[] = [];
  for (let y = currentYear + 1; y >= 2010; y--) {
    yearOptions.push(y);
  }

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!namaLengkap.trim()) {
      setErrorMessage('Nama Lengkap wajib diisi sesuai dokumen asli.');
      return;
    }
    if (!nisn.trim() || nisn.replace(/\D/g, '').length !== 10) {
      setErrorMessage('NISN harus 10 digit angka valid.');
      return;
    }
    if (!nomorIjazah.trim()) {
      setErrorMessage('Nomor Seri Ijazah wajib diisi.');
      return;
    }
    if (!agreementChecked) {
      setErrorMessage('Anda wajib mencentang persetujuan keabsahan dokumen sebelum mengirim.');
      return;
    }

    const cleanNisn = nisn.replace(/\D/g, '');
    const cleanWa = normalizeWhatsapp(nomorWhatsapp);
    const newRecordId = generateRecordId();
    const newArchiveNo = generateArchiveNumber(existingRecords, unit, tahunLulus);
    const nowTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // Duplicate Check
    const dupCheck = checkDuplicateRecord(existingRecords, cleanNisn, tahunLulus, unit, nomorIjazah);

    const folderPath = `ARSIP IJAZAH DIGITAL / ${tahunLulus} / ${unit}`;

    const newRecord: ArchiveRecord = {
      idRecord: newRecordId,
      nomorArsip: newArchiveNo,
      timestamp: nowTimestamp,
      namaLengkap: namaLengkap.trim(),
      nisn: cleanNisn,
      nis: nis.trim() || '-',
      tempatLahir: tempatLahir.trim() || '-',
      tanggalLahir: tanggalLahir || '-',
      jenisKelamin: jenisKelamin,
      unit: unit,
      tahunLulus: Number(tahunLulus),
      namaAyahWali: namaAyahWali.trim() || '-',
      namaIbuWali: namaIbuWali.trim() || '-',
      nomorWhatsapp: cleanWa,
      alamat: alamat.trim() || '-',
      nomorIjazah: nomorIjazah.trim(),
      tanggalTerbitIjazah: tanggalTerbitIjazah || '-',
      tahunIjazah: Number(tahunIjazah),
      nomorUjian: nomorUjian.trim() || '-',
      statusDokumen: statusDokumen,
      keteranganTambahan: keteranganTambahan.trim(),
      fileIjazahDepan: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      fileIjazahBelakang: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      filePendukung: filePendukungName ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80' : '',
      folderArsip: folderPath,
      statusKelengkapan: 'LENGKAP',
      statusVerifikasi: 'BELUM DIVERIFIKASI',
      verifiedBy: '-',
      verifiedAt: '-',
      catatanVerifikasi: dupCheck.isDuplicate ? `PERINGATAN: NISN SUDAH PERNAH TERDAFTAR (${dupCheck.reason})` : '',
      statusArsip: 'AKTIF',
      lastUpdated: nowTimestamp,
      isDuplicateWarning: dupCheck.isDuplicate
    };

    onNewSubmission(newRecord);
    setSubmittedRecord(newRecord);
  };

  const handleReset = () => {
    setSubmittedRecord(null);
    setCurrentStep(1);
    setNamaLengkap('');
    setNisn('');
    setNis('');
    setTempatLahir('');
    setTanggalLahir('');
    setNomorIjazah('');
    setNomorWhatsapp('');
    setAlamat('');
    setNamaAyahWali('');
    setNamaIbuWali('');
    setAgreementChecked(false);
  };

  // Success Screen
  if (submittedRecord) {
    return (
      <div className="max-w-2xl mx-auto bg-slate-800/90 border border-emerald-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-950 border border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit',sans-serif]">
            Data Arsip Ijazah Berhasil Diterima!
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            Ma’had Darul Hadits Lima Puluh Kota telah mencatat metadata dokumen Anda ke dalam Google Sheets database dan mengorganisir berkas di Google Drive.
          </p>
        </div>

        {/* Generated Archive Number Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 text-center space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Nomor Registrasi Arsip Digital Resmi:
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 tracking-wider">
            {submittedRecord.nomorArsip}
          </div>
          <div className="text-xs text-slate-400">
            ID Record Database: <span className="font-mono text-slate-300">{submittedRecord.idRecord}</span>
          </div>

          {submittedRecord.isDuplicateWarning && (
            <div className="mt-3 p-2.5 rounded-lg bg-purple-950/80 border border-purple-600/50 text-purple-200 text-xs text-left">
              ⚠️ <strong>Peringatan Sistem:</strong> Terdeteksi potensi duplikasi data. Status saat ini diset sebagai <strong>POTENSI DUPLIKAT</strong> untuk ditinjau oleh tim administrator.
            </div>
          )}
        </div>

        {/* Stored Location info */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 text-xs text-left space-y-1.5 text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Nama Peserta Didik:</span>
            <span className="font-semibold text-white">{submittedRecord.namaLengkap}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">NISN / Unit:</span>
            <span>{submittedRecord.nisn} ({submittedRecord.unit} {submittedRecord.tahunLulus})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Penyimpanan Google Drive:</span>
            <span className="font-mono text-emerald-400 truncate max-w-[240px]">{submittedRecord.folderArsip}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status Verifikasi:</span>
            <span className="font-bold text-amber-400">{submittedRecord.statusVerifikasi}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onPrintSlip(submittedRecord)}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow transition flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Bukti Tanda Terima Arsip</span>
          </button>

          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition"
          >
            Isi Pengajuan Lainnya
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Form Header */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <School className="w-4 h-4" />
          <span>Ma’had Darul Hadits Lima Puluh Kota</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit',sans-serif]">
          FORMULIR ARSIP DIGITAL IJAZAH PESERTA DIDIK
        </h1>
        
        <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-300 leading-relaxed">
          <p className="font-semibold text-emerald-300 mb-1">Bismillāhirraḥmānirraḥīm</p>
          <p className="mb-2">Assalāmu‘alaikum warahmatullāhi wabarakātuh.</p>
          <p className="text-slate-300">
            Dalam rangka menjaga keamanan dan ketersediaan dokumen penting peserta didik, Ma’had Darul Hadits Lima Puluh Kota melakukan pendataan dan pengarsipan digital ijazah/alumni.
            Mohon seluruh data diisi sesuai dengan dokumen asli dan foto/scan ijazah yang diunggah harus jelas serta dapat dibaca.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-slate-700 text-xs font-semibold">
          <div className={`p-2 rounded-lg text-center ${currentStep === 1 ? 'bg-emerald-600 text-white' : currentStep > 1 ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40' : 'bg-slate-900 text-slate-500'}`}>
            1. Identitas Siswa
          </div>
          <div className={`p-2 rounded-lg text-center ${currentStep === 2 ? 'bg-emerald-600 text-white' : currentStep > 2 ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40' : 'bg-slate-900 text-slate-500'}`}>
            2. Orang Tua / Wali
          </div>
          <div className={`p-2 rounded-lg text-center ${currentStep === 3 ? 'bg-emerald-600 text-white' : currentStep > 3 ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40' : 'bg-slate-900 text-slate-500'}`}>
            3. Data Ijazah
          </div>
          <div className={`p-2 rounded-lg text-center ${currentStep === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-500'}`}>
            4. Upload & Kirim
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Multi-Step Form */}
      <form onSubmit={handleSubmit} className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-lg space-y-5">
        
        {/* STEP 1: SECTION A — IDENTITAS PESERTA DIDIK */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white font-['Outfit',sans-serif] border-b border-slate-700 pb-2">
              SECTION A — IDENTITAS PESERTA DIDIK
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                1. Nama Lengkap Peserta Didik <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Contoh: Muhammad Fathurrahman Al-Farisi"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  2. NISN (10 Digit Angka) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  placeholder="Contoh: 0061234567"
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  3. NIS / Nomor Induk Peserta Didik
                </label>
                <input
                  type="text"
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  placeholder="Contoh: 20200101"
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  4. Tempat Lahir
                </label>
                <input
                  type="text"
                  value={tempatLahir}
                  onChange={(e) => setTempatLahir(e.target.value)}
                  placeholder="Contoh: Payakumbuh"
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  5. Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  6. Jenis Kelamin <span className="text-rose-400">*</span>
                </label>
                <select
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  7. Unit / Satuan Pendidikan <span className="text-rose-400">*</span>
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as UnitType)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-emerald-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="SD">SD</option>
                  <option value="SMP">SMP / MTs</option>
                  <option value="SMA">SMA / MA</option>
                  <option value="PKBM">PKBM</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  8. Tahun Lulus <span className="text-rose-400">*</span>
                </label>
                <select
                  value={tahunLulus}
                  onChange={(e) => {
                    setTahunLulus(Number(e.target.value));
                    setTahunIjazah(Number(e.target.value));
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {yearOptions.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => {
                  if (!namaLengkap.trim()) {
                    setErrorMessage('Mohon lengkapi Nama Lengkap.');
                    return;
                  }
                  if (!nisn.trim() || nisn.replace(/\D/g, '').length !== 10) {
                    setErrorMessage('NISN harus tepat 10 digit.');
                    return;
                  }
                  setErrorMessage('');
                  setCurrentStep(2);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                <span>Lanjut: Data Orang Tua</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SECTION B — DATA ORANG TUA / WALI */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white font-['Outfit',sans-serif] border-b border-slate-700 pb-2">
              SECTION B — DATA ORANG TUA / WALI
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  9. Nama Ayah / Wali <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={namaAyahWali}
                  onChange={(e) => setNamaAyahWali(e.target.value)}
                  placeholder="Nama lengkap Ayah"
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  10. Nama Ibu / Wali <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={namaIbuWali}
                  onChange={(e) => setNamaIbuWali(e.target.value)}
                  placeholder="Nama lengkap Ibu"
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                11. Nomor WhatsApp Aktif <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={nomorWhatsapp}
                onChange={(e) => setNomorWhatsapp(e.target.value)}
                placeholder="Contoh: 081234567890 (Otomatis dinormalisasi ke 628...)"
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Nomor ini digunakan untuk mengirimkan konfirmasi & nomor arsip digital ijazah.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                12. Alamat Saat Ini <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Alamat domisili lengkap..."
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!namaAyahWali.trim() || !namaIbuWali.trim() || !nomorWhatsapp.trim()) {
                    setErrorMessage('Mohon lengkapi data orang tua dan nomor WhatsApp.');
                    return;
                  }
                  setErrorMessage('');
                  setCurrentStep(3);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                <span>Lanjut: Data Ijazah</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SECTION C — DATA IJAZAH */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white font-['Outfit',sans-serif] border-b border-slate-700 pb-2">
              SECTION C — DATA IJAZAH
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  13. Nomor Seri / Nomor Ijazah <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nomorIjazah}
                  onChange={(e) => setNomorIjazah(e.target.value)}
                  placeholder="Contoh: DN-08/D-SMP/K13/26/0014521"
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  14. Tanggal Terbit Ijazah
                </label>
                <input
                  type="date"
                  value={tanggalTerbitIjazah}
                  onChange={(e) => setTanggalTerbitIjazah(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  15. Tahun Ijazah
                </label>
                <select
                  value={tahunIjazah}
                  onChange={(e) => setTahunIjazah(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {yearOptions.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  16. Nomor Peserta / Nomor Ujian
                </label>
                <input
                  type="text"
                  value={nomorUjian}
                  onChange={(e) => setNomorUjian(e.target.value)}
                  placeholder="Contoh: 08-050-001-8"
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                17. Status Dokumen Fisik <span className="text-rose-400">*</span>
              </label>
              <select
                value={statusDokumen}
                onChange={(e) => setStatusDokumen(e.target.value as StatusDokumen)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Ijazah asli tersedia">Ijazah asli tersedia</option>
                <option value="Ijazah rusak">Ijazah rusak</option>
                <option value="Ijazah hilang">Ijazah hilang</option>
                <option value="Surat keterangan pengganti">Surat keterangan pengganti</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                18. Keterangan Tambahan
              </label>
              <textarea
                rows={2}
                value={keteranganTambahan}
                onChange={(e) => setKeteranganTambahan(e.target.value)}
                placeholder="Catatan prestasi, kelulusan tahfidz, peminatan, dll..."
                className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!nomorIjazah.trim()) {
                    setErrorMessage('Mohon isi nomor seri ijazah.');
                    return;
                  }
                  setErrorMessage('');
                  setCurrentStep(4);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                <span>Lanjut: Upload Dokumen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SECTION D — UPLOAD DOKUMEN & PERSETUJUAN */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white font-['Outfit',sans-serif] border-b border-slate-700 pb-2">
              SECTION D — UPLOAD DOKUMEN & PERSETUJUAN
            </h2>

            {/* Instruction Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-emerald-400 flex items-center space-x-1.5 mb-1">
                <Info className="w-4 h-4" />
                <span>Petunjuk Foto / Scan Dokumen:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                <li>Seluruh dokumen terlihat dan posisi tegak/lurus (tidak miring).</li>
                <li>Tidak terpotong, tidak buram, dan seluruh tulisan dapat dibaca.</li>
                <li>Pencahayaan cukup dan tidak terdapat pantulan cahaya atau filter.</li>
                <li>Format didukung: PDF, JPG, PNG (Maks 10 MB).</li>
              </ul>
            </div>

            {/* Upload File 19: Halaman Depan */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700 space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                19. Upload Ijazah Halaman Depan <span className="text-rose-400">*</span>
              </label>
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-emerald-500 transition cursor-pointer">
                <UploadCloud className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs text-emerald-400 font-semibold block">{fileDepanName}</span>
                <span className="text-[10px] text-slate-400">Tersimpan otomatis ke Google Drive / {tahunLulus} / {unit}</span>
              </div>
            </div>

            {/* Upload File 20: Halaman Belakang */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700 space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                20. Upload Ijazah Halaman Belakang / Nilai
              </label>
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-emerald-500 transition cursor-pointer">
                <UploadCloud className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs text-emerald-400 font-semibold block">{fileBelakangName}</span>
                <span className="text-[10px] text-slate-400">Daftar nilai kelulusan / transkrip</span>
              </div>
            </div>

            {/* Upload File 21: Dokumen Pendukung */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700 space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                21. Upload Dokumen Pendukung (Opsional)
              </label>
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-3 text-center">
                <span className="text-xs text-slate-400">Surat Keterangan Lulus / Akta / Piagam Tahfidz</span>
              </div>
            </div>

            {/* Checkbox Persetujuan */}
            <div className="pt-2">
              <label className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-600"
                />
                <span className="text-xs text-slate-200 leading-relaxed font-medium">
                  Saya menyatakan bahwa data dan dokumen yang saya kirimkan sesuai dengan dokumen yang saya miliki dan dapat digunakan oleh lembaga untuk keperluan administrasi serta arsip digital.
                </span>
              </label>
            </div>

            {/* Navigation & Submit */}
            <div className="flex justify-between pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <button
                type="submit"
                disabled={isSyncingGas}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-950/50 transition flex items-center space-x-2 transform active:scale-95"
              >
                <CheckCircle2 className={`w-4 h-4 ${isSyncingGas ? 'animate-spin' : ''}`} />
                <span>{isSyncingGas ? 'Menyinkronkan ke Google Sheets...' : 'KIRIM ARSIP IJAZAH SEKARANG'}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
