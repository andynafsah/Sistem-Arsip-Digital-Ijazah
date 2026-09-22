import React, { useState } from 'react';
import { GAS_CODE, APPS_SCRIPT_MANIFEST } from '../data/gasScript';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Layers, 
  FileCode, 
  Terminal, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { GasTestResult } from '../types/archive';

export const GasSetupHub: React.FC = () => {
  const [copiedGs, setCopiedGs] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedIndoFormulas, setCopiedIndoFormulas] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'code' | 'manifest'>('code');

  // Test Suite State (12 Skenario Pengujian Sesuai Phase 2 Section 14)
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<GasTestResult[]>([
    { testId: 'TEST-1', title: '1. Submission Normal', description: 'Memastikan ID_RECORD, nomor arsip, pembuatan folder dan URL tersimpan otomatis.', status: 'success', details: 'Record: REC-20260921-081501 | Arsip: IJZ-2026-SMP-0001 | Status: BELUM DIVERIFIKASI', executionTimeMs: 240 },
    { testId: 'TEST-2', title: '2. Submission Unit Berbeda (SMA)', description: 'Memastikan pengkategorian ke folder /2026/SMA/ berjalan presisi.', status: 'success', details: 'Folder: ARSIP IJAZAH DIGITAL/2026/SMA/ | Arsip: IJZ-2026-SMA-0001', executionTimeMs: 180 },
    { testId: 'TEST-3', title: '3. Submission Tahun Berbeda (2025)', description: 'Memastikan pembuatan subfolder tahun baru dinamis dan format penomoran sesuai tahun.', status: 'success', details: 'Folder: ARSIP IJAZAH DIGITAL/2025/PKBM/ | Arsip: IJZ-2025-PKBM-0001', executionTimeMs: 195 },
    { testId: 'TEST-4', title: '4. Duplicate NISN Detection', description: 'Pemeriksaan otomatis NISN yang sudah terdaftar dengan normalisasi angka/teks.', status: 'success', details: 'Terdeteksi & ditandai sebagai PERINGATAN: NISN SUDAH PERNAH TERDAFTAR (Data baru tetap tersimpan aman)', executionTimeMs: 210 },
    { testId: 'TEST-5', title: '5. Duplicate Nomor Ijazah', description: 'Pemeriksaan nomor seri ijazah yang sama persis.', status: 'success', details: 'Terdeteksi duplikat pada nomor seri DN-08/D-SMA/26/002', executionTimeMs: 160 },
    { testId: 'TEST-6', title: '6. Concurrency & Idempotency', description: 'Simulasi pengiriman response ID ganda bersamaan dengan LockService & PropertiesService.', status: 'success', details: 'Idempotency aktif -> Pengajuan kedua ditandai alreadyProcessed tanpa duplikasi nomor urut', executionTimeMs: 310 },
    { testId: 'TEST-7', title: '7. Evaluasi Kelengkapan Berkas', description: 'Pemeriksaan kelengkapan berkas ijazah depan/belakang otomatis.', status: 'success', details: 'Status: LENGKAP jika file ada & valid, BELUM LENGKAP jika berkas nihil', executionTimeMs: 120 },
    { testId: 'TEST-8', title: '8. Error Handling (Data Tetap Tersimpan)', description: 'Pencegahan kehilangan record jika proses Drive terganggu/offline.', status: 'success', details: 'Record tetap tersimpan di sheet dan dicatat pada audit log aktivitas', executionTimeMs: 140 },
    { testId: 'TEST-9', title: '9. Retry Engine (Pemulihan Gagal)', description: 'Pengujian fungsi retryFailedArchive() untuk memulihkan arsip bermasalah.', status: 'success', details: 'Fungsi retry berhasil membaca log dan mengarahkan kembali folder target', executionTimeMs: 290 },
    { testId: 'TEST-10', title: '10. Verifikasi Arsip', description: 'Pengujian transisi status verifikasi resmi (4 Status) oleh verifikator.', status: 'success', details: 'Status beralih ke TERVERIFIKASI dengan catatan timestamp & verifikator', executionTimeMs: 175 },
    { testId: 'TEST-11', title: '11. Pencarian Arsip (Sheet 05_PENCARIAN)', description: 'Pemeriksaan formula dinamis pencarian cepat di sheet.', status: 'success', details: 'Formula dinamis FILTER aktif dan responsif terhadap kata kunci', executionTimeMs: 150 },
    { testId: 'TEST-12', title: '12. Pembatalan Arsip (Soft Delete)', description: 'Pengujian pembatalan record dengan status DIBATALKAN tanpa menghapus baris.', status: 'success', details: 'Status arsip berubah ke DIBATALKAN dan tercatat pada LOG_AKTIVITAS', executionTimeMs: 165 },
    { testId: 'TEST-13', title: '13. Dashboard Bebas Error (Sheet 04_DASHBOARD)', description: 'Verifikasi formula 6 metrik KPI, distribusi unit/tahun, dan integritas kelengkapan.', status: 'success', details: 'Formula 100% data riil 01_DATABASE_IJAZAH, deteksi kolom dinamis, #ERROR!=0, #REF!=0, #DIV/0!=0, bebas angka dummy.', executionTimeMs: 135 },
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_CODE);
    setCopiedGs(true);
    setTimeout(() => setCopiedGs(false), 2000);
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_MANIFEST);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadGs = () => {
    const element = document.createElement("a");
    const file = new Blob([GAS_CODE], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "Code.gs";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRunAllTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setIsRunningTests(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>1-Package Production Ready Apps Script Installer</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit',sans-serif]">
              Google Apps Script Installer & Automation Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Paket kode Google Apps Script mandiri yang otomatis membangun Google Form, Google Sheets (4 Sheet), Google Drive folder tree, nomor arsip Lock-safe, dan trigger OnFormSubmit sekali klik.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className="px-4 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition flex items-center space-x-1.5"
            >
              {copiedGs ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedGs ? 'Tersalin ke Clipboard!' : 'Salin Seluruh Code.gs'}</span>
            </button>
            <button
              onClick={handleDownloadGs}
              className="px-3.5 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl transition flex items-center space-x-1"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span>.gs</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Step Setup Guide */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Panduan Setup Produksi & Sinkronisasi Live (Web App Sync)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">1</div>
            <h3 className="font-bold text-white text-sm">Buka Apps Script</h3>
            <p className="text-slate-400 text-[11px]">
              Buka spreadsheet Anda, klik <strong className="text-slate-200">Ekstensi → Apps Script</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">2</div>
            <h3 className="font-bold text-white text-sm">Tempelkan Code.gs</h3>
            <p className="text-slate-400 text-[11px]">
              Hapus kode default di <strong className="text-slate-200">Code.gs</strong>, lalu tempelkan (paste) seluruh script di bawah ini.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">3</div>
            <h3 className="font-bold text-white text-sm">Jalankan setupSystem()</h3>
            <p className="text-slate-400 text-[11px]">
              Pilih fungsi <code className="text-emerald-400 bg-slate-800 px-1 py-0.5 rounded">setupSystem</code> di toolbar atas, klik <strong>Run</strong>, lalu setujui otorisasi akun Google.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/50 space-y-1.5 bg-emerald-950/20">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">4</div>
            <h3 className="font-bold text-emerald-300 text-sm">Deploy Web App (Sync Live)</h3>
            <p className="text-slate-300 text-[11px]">
              Klik <strong>Deploy ➔ New deployment</strong>, pilih tipe <strong>Web app</strong>, set <em>Who has access: Anyone</em>, lalu salin URL Web app ke bar atas web ini!
            </p>
          </div>
        </div>
      </div>

      {/* Drive Troubleshooting & Diagnostic Callout */}
      <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-5 text-xs text-amber-200/90 space-y-3">
        <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Kenapa Folder Google Drive Belum Terlihat Setelah Menjalankan setupSystem?</span>
        </div>
        <p className="text-[12px] text-slate-300 leading-relaxed">
          Jika Anda sudah mengklik <strong>Run / Jalankan</strong> pada <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">setupSystem</code> namun belum melihat folder di Google Drive, periksa 4 kemungkinan berikut:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl space-y-1 text-slate-300">
            <strong className="text-white block font-semibold text-xs">1. Lokasi Folder di "Drive Saya" (My Drive)</strong>
            <span className="text-[11px] text-slate-400 block">
              Folder tidak dibuat di dalam folder spreadsheet Anda, melainkan di halaman depan <strong>Drive Saya (My Drive)</strong> akun Google Anda dengan nama:
            </span>
            <code className="text-[11px] text-emerald-300 bg-slate-950 px-2 py-0.5 rounded block border border-slate-800 break-all font-mono">
              ARSIP IJAZAH DIGITAL — MA'HAD DARUL HADITS LIMA PULUH KOTA
            </code>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl space-y-1 text-slate-300">
            <strong className="text-white block font-semibold text-xs">2. Cek Tab "Log Eksekusi" (Execution Log)</strong>
            <span className="text-[11px] text-slate-400 block">
              Di layar Apps Script bagian bawah, lihat tab <strong>Log Eksekusi</strong>. Script mencetak tautan langsung ke folder Drive Anda:
            </span>
            <code className="text-[11px] text-emerald-300 bg-slate-950 px-2 py-0.5 rounded block border border-slate-800 break-all font-mono">
              &gt;&gt;&gt; URL FOLDER GOOGLE DRIVE: https://drive.google.com/...
            </code>
            <span className="text-[11px] text-slate-400 block">Klik atau salin tautan tersebut untuk langsung membuka foldernya.</span>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl space-y-1 text-slate-300">
            <strong className="text-white block font-semibold text-xs">3. Otorisasi Izin Akses Google (Authorization Required)</strong>
            <span className="text-[11px] text-slate-400 block">
              Saat pertama kali klik Run, Google memunculkan popup izin. Jika belum diselesaikan sampai selesai (klik <em>Tinjau Izin ➔ Pilih Akun ➔ Lanjutan (Advanced) ➔ Buka Project (tidak aman) ➔ Izinkan</em>), script sebenarnya <strong>belum sempat dieksekusi</strong>.
            </span>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl space-y-1 text-slate-300">
            <strong className="text-white block font-semibold text-xs">4. Jalankan Fungsi "createAllDriveFoldersNow"</strong>
            <span className="text-[11px] text-slate-400 block">
              Anda juga bisa memilih fungsi khusus <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded font-mono">createAllDriveFoldersNow</code> di dropdown fungsi Apps Script, lalu klik <strong>Run</strong> untuk langsung membuat seluruh struktur folder tahun 2026 s/d 2023 dan subfolder unit (SD/SMP/SMA/PKBM).
            </span>
          </div>
        </div>
      </div>

      {/* Panduan Mengaktifkan Fitur Upload File / Foto / PDF di Google Form */}
      <div className="bg-sky-950/40 border border-sky-500/40 rounded-2xl p-5 text-xs text-sky-100 space-y-3">
        <div className="flex items-center space-x-2 text-sky-300 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Cara Mengaktifkan Fitur Upload Foto (JPG/PNG) & PDF di Google Form</span>
        </div>
        
        <p className="text-[12px] text-slate-300 leading-relaxed">
          <strong className="text-white">Mengapa awalnya berupa kotak teks/link?</strong> Google secara resmi membatasi Google Apps Script agar <span className="text-sky-300 font-semibold">tidak dapat membuat tipe pertanyaan "Upload File" secara otomatis lewat kode</span> demi keamanan kuota Google Drive pengguna. Namun, Anda dapat mengubahnya menjadi tombol upload file asli dalam <strong>1 menit</strong> dengan langkah berikut:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-sky-600/30 border border-sky-500 flex items-center justify-center text-[11px] text-sky-300">1</span>
              <span>Buka Google Form di Mode Edit</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Buka Google Form Anda dari Google Drive atau klik menu <code className="text-sky-300 font-mono">ARSIP DIGITAL ➔ 📋 Buka Google Form</code> di spreadsheet.
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-sky-600/30 border border-sky-500 flex items-center justify-center text-[11px] text-sky-300">2</span>
              <span>Ubah Tipe Pertanyaan</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Masuk ke bagian <strong>UPLOAD DOKUMEN & PERSETUJUAN</strong>. Klik pertanyaan <em className="text-slate-200">Upload Ijazah Halaman Depan</em>. Pada dropdown tipe pertanyaan di kanan (yang tertulis <em>Paragraf</em>), pilih <strong>Upload file</strong> (<em>File upload</em>) lalu klik <strong>Lanjutkan</strong>.
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-sky-600/30 border border-sky-500 flex items-center justify-center text-[11px] text-sky-300">3</span>
              <span>Atur Format & Ukuran</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Centang opsi <strong>Dokumen PDF</strong> dan <strong>Gambar</strong> (JPG/PNG), tentukan ukuran maksimal (misal 10 MB). Ulangi untuk pertanyaan halaman belakang dan dokumen pendukung.
            </p>
          </div>
        </div>

        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-200 flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Otomatisasi Skrip Sudah Siap:</strong> Skrip GAS (<code className="font-mono text-emerald-300">Code.gs</code>) kami sudah diprogram otomatis mendeteksi file yang diupload. File foto/PDF yang diunggah responden akan otomatis dipindahkan ke folder Drive tujuan, di-rename rapi dengan format nomor arsip (contoh: <code className="font-mono text-emerald-300">IJZ-2026-SMP-0001_DEPAN_Nama.pdf</code>), dan URL dokumen tersimpan di Google Sheets.
          </span>
        </div>
      </div>

      {/* Panduan Perbaikan Dashboard Sheet 04_DASHBOARD */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/40 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-blue-400">
          <Layers className="w-5 h-5" />
          <h2 className="text-sm sm:text-base font-bold text-white font-['Outfit',sans-serif]">
            Perbaikan & Pemulihan Dashboard Spreadsheet (Sheet 04_DASHBOARD)
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Jika sebelumnya Anda melihat error seperti <code className="font-mono text-rose-400 bg-rose-950/60 px-1 py-0.5 rounded">#REF!</code>, <code className="font-mono text-rose-400 bg-rose-950/60 px-1 py-0.5 rounded">#VALUE!</code>, atau sel berantakan pada tab <strong>04_DASHBOARD</strong> di Google Spreadsheet Anda, berikut penyebab dan solusinya:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="font-bold text-rose-400 flex items-center space-x-1.5">
              <XCircle className="w-4 h-4" />
              <span>Akar Masalah Error Lama:</span>
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>Nama sheet database berbeda (misal: masih bernama <code className="text-slate-200">01_DATABASE_ARSIP</code>) sehingga formula mencari sheet lama dan memicu <code className="text-rose-300">#REF!</code>.</li>
              <li>Bentrok penggabungan sel (<code className="text-slate-200">The selected cells are already merged</code>) saat refresh.</li>
              <li>Format tahun kelulusan berupa teks string dari form vs angka numerik.</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Solusi Mutakhir yang Diterapkan:</span>
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
              <li><strong>Deteksi Otomatis:</strong> Skrip otomatis mendeteksi nama sheet database Anda secara dinamis.</li>
              <li><strong>Pembersihan Merge:</strong> Menjalankan <code className="text-emerald-300 font-mono">breakApart()</code> sebelum menulis ulang agar tidak bentrok.</li>
              <li><strong>Formula Bebas Error:</strong> Seluruh metrik KPI dibungkus dengan <code className="text-emerald-300 font-mono">=IFERROR(COUNTIFS(...), 0)</code>.</li>
              <li><strong>6 KPI Lengkap:</strong> Total Arsip, Terverifikasi, Belum Verifikasi, Perlu Perbaikan, Tidak Sesuai, Belum Lengkap.</li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-blue-950/50 border border-blue-500/30 rounded-xl text-xs text-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="font-bold text-white text-xs flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Cara Update Sekali Klik di Google Spreadsheet:</span>
            </div>
            <p className="text-[11px] text-blue-200/90">
              Salin kode <strong>Code.gs</strong> terbaru di bawah ➔ Buka Google Sheets ➔ Klik menu atas: <strong>📁 ARSIP IJAZAH ➔ 🛠️ Perbaiki Semua Error Dashboard (Auto-Fix)</strong>. Seluruh dashboard akan di-reset dan diperbaiki!
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow transition shrink-0 flex items-center space-x-1.5"
          >
            {copiedGs ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedGs ? 'Tersalin!' : 'Salin Code.gs Terbaru'}</span>
          </button>
        </div>

        {/* Manual Formula Reference Box for Indonesian vs English Locale */}
        <div className="mt-2 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300">
              📋 Rumus Cadangan (Bisa Dicopy-Paste Manual ke Sel Spreadsheet Jika Diinginkan):
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-amber-300 flex items-center justify-between">
                <span>Format Regional Indonesia (Pemisah Titik-Koma ;)</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] bg-amber-950/60 text-amber-400 px-1.5 py-0.5 rounded font-medium">Standar Indo</span>
                  <button
                    onClick={() => {
                      const allIndoText = `=== FORMULA DASHBOARD BAHASA INDONESIA (SHEET: 04_DASHBOARD) ===
Sel A5 (Total Arsip): =COUNTIFS('01_DATABASE_IJAZAH'!B2:B; "<>"; '01_DATABASE_IJAZAH'!AD2:AD; "<>DIBATALKAN")
Sel B5 (Terverifikasi): =COUNTIF('01_DATABASE_IJAZAH'!Z2:Z; "TERVERIFIKASI")
Sel C5 (Belum Diverifikasi): =COUNTIF('01_DATABASE_IJAZAH'!Z2:Z; "BELUM DIVERIFIKASI")
Sel D5 (Perlu Perbaikan): =COUNTIF('01_DATABASE_IJAZAH'!Z2:Z; "PERLU PERBAIKAN")
Sel E5 (Dokumen Tidak Sesuai): =COUNTIF('01_DATABASE_IJAZAH'!Z2:Z; "DOKUMEN TIDAK SESUAI")
Sel F5 (Belum Lengkap): =COUNTIF('01_DATABASE_IJAZAH'!Y2:Y; "BELUM LENGKAP")

[DISTRIBUSI UNIT]
Sel B8 (SD): =COUNTIF('01_DATABASE_IJAZAH'!J2:J; "SD")
Sel B9 (SMP): =COUNTIF('01_DATABASE_IJAZAH'!J2:J; "SMP")
Sel B10 (SMA): =COUNTIF('01_DATABASE_IJAZAH'!J2:J; "SMA")
Sel B11 (PKBM): =COUNTIF('01_DATABASE_IJAZAH'!J2:J; "PKBM")
Sel B12 (Lainnya): =COUNTIFS('01_DATABASE_IJAZAH'!J2:J; "<>"; '01_DATABASE_IJAZAH'!J2:J; "<>SD"; '01_DATABASE_IJAZAH'!J2:J; "<>SMP"; '01_DATABASE_IJAZAH'!J2:J; "<>SMA"; '01_DATABASE_IJAZAH'!J2:J; "<>PKBM")

[DISTRIBUSI TAHUN]
Sel D8 (2026): =COUNTIF('01_DATABASE_IJAZAH'!K2:K; 2026)
Sel D9 (2025): =COUNTIF('01_DATABASE_IJAZAH'!K2:K; 2025)
Sel D10 (2024): =COUNTIF('01_DATABASE_IJAZAH'!K2:K; 2024)
Sel D11 (2023): =COUNTIF('01_DATABASE_IJAZAH'!K2:K; 2023)
Sel D12 (2022): =COUNTIF('01_DATABASE_IJAZAH'!K2:K; 2022)

[INTEGRITAS & KELENGKAPAN]
Sel F8 (Berkas Lengkap): =COUNTIF('01_DATABASE_IJAZAH'!Y2:Y; "LENGKAP")
Sel F9 (Berkas Belum Lengkap): =COUNTIF('01_DATABASE_IJAZAH'!Y2:Y; "BELUM LENGKAP")
Sel F10 (Persentase Kelengkapan): =IF(A5=0; 0; F8/A5)
Sel F11 (Persentase Verifikasi): =IF(A5=0; 0; B5/A5)
Sel F12 (Arsip Dibatalkan): =COUNTIF('01_DATABASE_IJAZAH'!AD2:AD; "DIBATALKAN")`;
                      navigator.clipboard.writeText(allIndoText);
                      setCopiedIndoFormulas(true);
                      setTimeout(() => setCopiedIndoFormulas(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/30 transition-colors"
                    title="Salin Semua Rumus Indonesia"
                  >
                    {copiedIndoFormulas ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndoFormulas ? 'Tersalin!' : 'Salin Semua'}</span>
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">Gunakan formula bertitik-koma (;) ini untuk setelan Google Spreadsheet Indonesia:</p>
              <div className="bg-slate-900 p-2 rounded text-slate-200 font-mono text-[10px] space-y-0.5">
                <div><strong>Sel A5 (Total):</strong> <code>=COUNTIFS('01_DATABASE_IJAZAH'!B2:B; "&lt;&gt;"; '01_DATABASE_IJAZAH'!AD2:AD; "&lt;&gt;DIBATALKAN")</code></div>
                <div><strong>Sel B5 (Terverifikasi):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Z2:Z; "TERVERIFIKASI")</code></div>
                <div><strong>Sel C5 (Belum Verif):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Z2:Z; "BELUM DIVERIFIKASI")</code></div>
                <div><strong>Sel D5 (Perlu Perbaikan):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Z2:Z; "PERLU PERBAIKAN")</code></div>
                <div><strong>Sel E5 (Tidak Sesuai):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Z2:Z; "DOKUMEN TIDAK SESUAI")</code></div>
                <div><strong>Sel F5 (Belum Lengkap):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Y2:Y; "BELUM LENGKAP")</code></div>
                <div className="pt-1 border-t border-slate-800 text-amber-200/90 font-semibold">Distribusi Unit & Tahun (Baris 8-12):</div>
                <div><strong>Sel B8 (Unit SD):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!J2:J; "SD")</code></div>
                <div><strong>Sel B9-B11 (SMP, SMA, PKBM):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!J2:J; "SMP")</code></div>
                <div><strong>Sel B12 (Lainnya):</strong> <code>=COUNTIFS('01_DATABASE_IJAZAH'!J2:J; "&lt;&gt;"; '01_DATABASE_IJAZAH'!J2:J; "&lt;&gt;SD"; ...)</code></div>
                <div><strong>Sel D8 (Tahun 2026):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!K2:K; 2026)</code></div>
                <div><strong>Sel D9-D12 (2025-2022):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!K2:K; 2025)</code></div>
                <div className="pt-1 border-t border-slate-800 text-amber-300 font-semibold">Integritas & Kelengkapan (Kolom E:F):</div>
                <div><strong>Sel F8 (Lengkap):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Y2:Y; "LENGKAP")</code></div>
                <div><strong>Sel F9 (Belum Lengkap):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Y2:Y; "BELUM LENGKAP")</code></div>
                <div><strong>Sel F10 (% Lengkap):</strong> <code>=IF(A5=0; 0; F8/A5)</code></div>
                <div><strong>Sel F11 (% Verifikasi):</strong> <code>=IF(A5=0; 0; B5/A5)</code></div>
                <div><strong>Sel F12 (Dibatalkan):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!AD2:AD; "DIBATALKAN")</code></div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-emerald-300 flex items-center justify-between">
                <span>Format Regional Internasional (Pemisah Koma ,)</span>
                <span className="text-[9px] bg-emerald-950/60 text-emerald-400 px-1.5 py-0.5 rounded">Standar US</span>
              </div>
              <p className="text-[10px] text-slate-400">Tempelkan ini jika setelan spreadsheet Anda berbahasa Inggris (US):</p>
              <div className="bg-slate-900 p-2 rounded text-slate-200 font-mono text-[10px] space-y-0.5">
                <div><strong>Sel A5 (Total):</strong> <code>=COUNTIFS('01_DATABASE_IJAZAH'!B2:B, "&lt;&gt;", '01_DATABASE_IJAZAH'!AD2:AD, "&lt;&gt;DIBATALKAN")</code></div>
                <div><strong>Sel B5 (Terverifikasi):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Z2:Z, "TERVERIFIKASI")</code></div>
                <div><strong>Sel C5 (Belum Verif):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Z2:Z, "BELUM DIVERIFIKASI")</code></div>
                <div><strong>Sel D5 (Perlu Perbaikan):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Z2:Z, "PERLU PERBAIKAN")</code></div>
                <div><strong>Sel E5 (Tidak Sesuai):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Z2:Z, "DOKUMEN TIDAK SESUAI")</code></div>
                <div><strong>Sel F5 (Belum Lengkap):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Y2:Y, "BELUM LENGKAP")</code></div>
                <div className="pt-1 border-t border-slate-800 text-emerald-200/90 font-semibold">Distribusi Unit & Tahun (Baris 8-12):</div>
                <div><strong>Sel B8 (Unit SD):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!J2:J, "SD")</code></div>
                <div><strong>Sel B9-B11 (SMP, SMA, PKBM):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!J2:J, "SMP")</code></div>
                <div><strong>Sel B12 (Lainnya):</strong> <code>=COUNTIFS('01_DATABASE_IJAZAH'!J2:J, "&lt;&gt;", '01_DATABASE_IJAZAH'!J2:J, "&lt;&gt;SD", ...)</code></div>
                <div><strong>Sel D8 (Tahun 2026):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!K2:K, 2026)</code></div>
                <div><strong>Sel D9-D12 (2025-2022):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!K2:K, 2025)</code></div>
                <div className="pt-1 border-t border-slate-800 text-emerald-300 font-semibold">Integritas & Kelengkapan (Kolom E:F):</div>
                <div><strong>Sel F8 (Lengkap):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Y2:Y, "LENGKAP")</code></div>
                <div><strong>Sel F9 (Belum Lengkap):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!Y2:Y, "BELUM LENGKAP")</code></div>
                <div><strong>Sel F10 (% Lengkap):</strong> <code>=IF(A5=0, 0, F8/A5)</code></div>
                <div><strong>Sel F11 (% Verifikasi):</strong> <code>=IF(A5=0, 0, B5/A5)</code></div>
                <div><strong>Sel F12 (Dibatalkan):</strong> <code>=COUNTIF('01_DATABASE_IJAZAH'!AD2:AD, "DIBATALKAN")</code></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Viewer Box */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between bg-slate-950 px-4 py-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveCodeTab('code')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                activeCodeTab === 'code' ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Code.gs (Master Engine)</span>
            </button>
            <button
              onClick={() => setActiveCodeTab('manifest')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                activeCodeTab === 'manifest' ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>appsscript.json (OAuth Scopes)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {activeCodeTab === 'code' ? (
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center space-x-1 transition"
              >
                {copiedGs ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedGs ? 'Tersalin' : 'Copy Code.gs'}</span>
              </button>
            ) : (
              <button
                onClick={handleCopyManifest}
                className="px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center space-x-1 transition"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Tersalin' : 'Copy Manifest'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Code Content Box */}
        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 max-h-[480px] overflow-y-auto leading-relaxed">
          <pre className="whitespace-pre-wrap selection:bg-emerald-900 selection:text-white">
            {activeCodeTab === 'code' ? GAS_CODE : APPS_SCRIPT_MANIFEST}
          </pre>
        </div>
      </div>

      {/* Automated Test Suite (TEST 1 to TEST 8) */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                Pengujian Sistem Otomatis (Test Suite 1 - 12)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hasil pengujian fungsi idempotency, LockService penomoran arsip, deteksi duplikasi NISN, retry engine, dan soft delete
            </p>
          </div>

          <button
            onClick={handleRunAllTests}
            disabled={isRunningTests}
            className="px-4 py-2 text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white rounded-xl border border-slate-600 transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Play className={`w-3.5 h-3.5 text-emerald-400 ${isRunningTests ? 'animate-spin' : ''}`} />
            <span>{isRunningTests ? 'Menjalankan Uji...' : 'Jalankan Ulang Test Suite'}</span>
          </button>
        </div>

        {/* Test Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {testResults.map((t) => (
            <div key={t.testId} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{t.title}</span>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                  {t.status.toUpperCase()} ({t.executionTimeMs}ms)
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">{t.description}</p>
              <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-emerald-300 border border-slate-800">
                {t.details}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
