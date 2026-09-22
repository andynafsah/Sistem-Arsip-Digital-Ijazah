import React, { useState } from 'react';
import { AdminUser, AuthResponse } from '../types/user';
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  KeyRound, 
  LogIn, 
  RefreshCw, 
  Sparkles, 
  AlertTriangle, 
  Building2, 
  Mail, 
  User, 
  Info,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Code2
} from 'lucide-react';
import { authenticateWithGAS, setupFirstAdminInGAS } from '../services/gasSyncService';
import { GAS_CODE } from '../data/gasScript';

interface AuthScreenProps {
  webAppUrl: string;
  onLoginSuccess: (user: AdminUser) => void;
  onOpenSetupHub: () => void;
  onUpdateWebAppUrl?: (url: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  webAppUrl,
  onLoginSuccess,
  onOpenSetupHub,
  onUpdateWebAppUrl
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<'IDLE' | 'CHECKING' | 'DENIED' | 'DEACTIVATED' | 'SETUP_REQUIRED' | 'SERVER_ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [attemptedEmail, setAttemptedEmail] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  
  // Custom Web App URL configuration state
  const [customUrl, setCustomUrl] = useState(webAppUrl || '');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [urlSavedMessage, setUrlSavedMessage] = useState(false);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateWebAppUrl) {
      onUpdateWebAppUrl(customUrl.trim());
      setUrlSavedMessage(true);
      setIsEditingUrl(false);
      setTimeout(() => setUrlSavedMessage(false), 3000);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GAS_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  // First Admin Setup Form State
  const [firstAdminNama, setFirstAdminNama] = useState('');
  const [firstAdminEmail, setFirstAdminEmail] = useState('');
  const [firstAdminUnit, setFirstAdminUnit] = useState('SEMUA');
  const [firstAdminConfirm, setFirstAdminConfirm] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);

  const handleAuthenticate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMessage('Silakan masukkan alamat Email Google administrator.');
      return;
    }

    const cleanEmail = emailInput.trim().toLowerCase();
    setAttemptedEmail(cleanEmail);
    setLoading(true);
    setAuthStatus('CHECKING');
    setErrorMessage('');

    try {
      const res: AuthResponse = await authenticateWithGAS(webAppUrl, cleanEmail);
      
      if (res.status === 'SUCCESS' && res.user) {
        onLoginSuccess(res.user);
      } else if (res.status === 'SETUP_REQUIRED' || res.isFirstAdminSetupRequired) {
        setAuthStatus('SETUP_REQUIRED');
        setFirstAdminEmail(cleanEmail);
      } else if (res.status === 'DEACTIVATED') {
        setAuthStatus('DEACTIVATED');
        setErrorMessage(res.message || 'Anda tidak memiliki akses ke Dashboard Arsip Digital Ijazah.');
      } else if (res.status === 'DENIED') {
        setAuthStatus('DENIED');
        setErrorMessage(res.message || 'Akun Google Anda belum terdaftar sebagai administrator sistem.');
      } else if (res.message && (res.message.includes('API Sistem Arsip Ijazah') || res.message.includes('aktif'))) {
        setAuthStatus('SERVER_ERROR');
        setErrorMessage('Google Apps Script Anda masih menjalankan versi deployment lama (belum memuat modul autentikasi 02_USERS_ADMIN). Silakan deploy ulang Apps Script dengan "Versi Baru" (Manage Deployments → Edit → New Version).');
      } else {
        setAuthStatus('SERVER_ERROR');
        setErrorMessage(res.message || 'Gagal memeriksa akses ke server Google Apps Script.');
      }
    } catch (err: any) {
      setAuthStatus('SERVER_ERROR');
      setErrorMessage(err.message || 'Terjadi kesalahan saat memverifikasi identitas pengguna.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupFirstAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstAdminNama.trim() || !firstAdminEmail.trim()) {
      setErrorMessage('Nama Lengkap dan Email Google wajib diisi.');
      return;
    }
    if (!firstAdminConfirm) {
      setErrorMessage('Silakan centang konfirmasi pendaftaran Super Admin.');
      return;
    }

    setSetupLoading(true);
    setErrorMessage('');

    try {
      const res = await setupFirstAdminInGAS(webAppUrl, {
        nama: firstAdminNama.trim(),
        email: firstAdminEmail.trim().toLowerCase(),
        unit: firstAdminUnit
      });

      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.message || 'Gagal menginisialisasi Super Admin pertama.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal melakukan inisialisasi Super Admin.');
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-600/20 blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-blue-600/15 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2 shadow-inner">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit',sans-serif] text-white">
            DASHBOARD ARSIP DIGITAL
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Ma'had Darul Hadits Lima Puluh Kota
          </p>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Google Account Authentication</span>
          </div>
        </div>

        {/* State 1: First Admin Setup (When Sheet 02_USERS_ADMIN is Empty) */}
        {authStatus === 'SETUP_REQUIRED' ? (
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-5">
            <div className="flex items-center space-x-3 text-emerald-400 pb-3 border-b border-slate-800">
              <Sparkles className="w-6 h-6 shrink-0" />
              <div>
                <h2 className="text-sm font-bold text-white">Inisialisasi Super Admin Pertama</h2>
                <p className="text-[11px] text-slate-400">Sheet <code className="text-emerald-300">02_USERS_ADMIN</code> belum memiliki administrator.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Sistem mendeteksi database user masih kosong. Daftarkan akun Google Anda sebagai <strong>SUPER_ADMIN</strong> pertama yang memegang otoritas penuh sistem arsip.
            </p>

            <form onSubmit={handleSetupFirstAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Lengkap Administrator <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Andy / Ustadz Fauzan"
                    value={firstAdminNama}
                    onChange={(e) => setFirstAdminNama(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Google Administrator <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama.akun@gmail.com"
                    value={firstAdminEmail}
                    onChange={(e) => setFirstAdminEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Unit Kewenangan
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={firstAdminUnit}
                    onChange={(e) => setFirstAdminUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SEMUA">SEMUA UNIT (Otoritas Penuh)</option>
                    <option value="SD">SD (Tingkat Dasar)</option>
                    <option value="SMP">SMP (Tingkat Menengah Pertama)</option>
                    <option value="SMA">SMA (Tingkat Menengah Atas)</option>
                    <option value="PKBM">PKBM</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={firstAdminConfirm}
                    onChange={(e) => setFirstAdminConfirm(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-emerald-200 leading-tight">
                    Saya mengonfirmasi bahwa akun Google ini adalah pemilik/administrator sah Ma'had Darul Hadits 50 Kota.
                  </span>
                </label>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setAuthStatus('IDLE'); setErrorMessage(''); }}
                  className="w-1/3 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={setupLoading || !firstAdminConfirm}
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/30 flex items-center justify-center space-x-2"
                >
                  {setupLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Sheet...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aktifkan Super Admin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : authStatus === 'DENIED' ? (
          /* State 2: Access Denied */
          <div className="bg-slate-900/90 border border-rose-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <UserX className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                AKSES DITOLAK
              </h2>
              <p className="text-xs text-rose-300 font-medium">
                Akun Google Anda belum terdaftar sebagai administrator sistem.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Email yang diperiksa:</span>
                <span className="font-mono text-white font-semibold">{attemptedEmail}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Status verifikasi:</span>
                <span className="text-rose-400 font-semibold">TIDAK TERDAFTAR</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 leading-relaxed">
                Silakan hubungi <strong>Super Admin / Tata Usaha Ma'had Darul Hadits 50 Kota</strong> untuk mendaftarkan akun Google Anda ke sheet <code className="text-emerald-300 font-mono">02_USERS_ADMIN</code>.
              </p>
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              <button
                type="button"
                onClick={() => { setAuthStatus('IDLE'); setErrorMessage(''); }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Email Google Lain</span>
              </button>

              <button
                type="button"
                onClick={onOpenSetupHub}
                className="w-full py-2 px-4 text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center justify-center space-x-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Buka Setup Hub & Script Installer</span>
              </button>
            </div>
          </div>
        ) : authStatus === 'DEACTIVATED' ? (
          /* State 3: Account Deactivated */
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                AKUN DINONAKTIFKAN
              </h2>
              <p className="text-xs text-amber-300 font-medium">
                Anda tidak memiliki akses ke Dashboard Arsip Digital Ijazah.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Akun Google:</span>
                <span className="font-mono text-white font-semibold">{attemptedEmail}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Status Akun:</span>
                <span className="text-amber-400 font-semibold">NONAKTIF</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 leading-relaxed">
                Status administrator untuk akun ini sedang dinonaktifkan oleh Super Admin. Hubungi Super Admin untuk mengaktifkan kembali akses Anda.
              </p>
            </div>

            <button
              type="button"
              onClick={() => { setAuthStatus('IDLE'); setErrorMessage(''); }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Kembali ke Halaman Login
            </button>
          </div>
        ) : (
          /* State 4: Default Login / Google Account Verification Gate */
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-5">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white font-['Outfit',sans-serif] flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>Autentikasi Administrator</span>
              </h2>
              <p className="text-xs text-slate-400">
                Akses dashboard diproteksi langsung oleh Google Apps Script & Google Sheets <code className="text-emerald-300 font-mono">02_USERS_ADMIN</code>.
              </p>
            </div>

            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Akun Google Administrator <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="masukkan.email@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Identitas diverifikasi langsung ke server tanpa password buatan/hardcode.
                </p>
              </div>

              {errorMessage && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start space-x-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-rose-200">Perhatian Update Apps Script</p>
                      <p className="leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>

                  {/* Quick Action Deployment Guide Card */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-400 flex items-center space-x-1.5">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Kode Apps Script v2.6:</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyScript}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors flex items-center space-x-1 shadow-sm"
                      >
                        {copiedScript ? (
                          <>
                            <Check className="w-3 h-3 text-white" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Kode</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-1 pl-1 border-l-2 border-emerald-500/40">
                      <p><strong>1.</strong> Klik <strong>Salin Kode</strong> di atas.</p>
                      <p><strong>2.</strong> Buka Apps Script & paste ke <code className="text-emerald-300">Code.gs</code> lalu Simpan (Ctrl+S).</p>
                      <p><strong>3.</strong> Pilih fungsi <code className="text-emerald-300">setupAdminUsersSheet</code> & klik Run.</p>
                      <p><strong>4.</strong> Klik <strong>Deploy</strong> → <strong>Manage deployments</strong> → Edit (Pensil) → Pilih <strong>"New version"</strong> → <strong>Deploy</strong>.</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/30 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memeriksa Akun Google di Sheet...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Periksa Hak Akses & Masuk</span>
                  </>
                )}
              </button>
            </form>

            {/* Web App URL Connection Status & Editor */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[200px]" title={webAppUrl || 'Belum terhubung'}>
                  URL: <code className="text-slate-300 font-mono text-[10px]">{webAppUrl ? `${webAppUrl.slice(0, 32)}...` : 'Belum terisi'}</code>
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingUrl(!isEditingUrl)}
                  className="text-emerald-400 hover:underline text-[11px]"
                >
                  {isEditingUrl ? 'Batal' : 'Ganti URL Web App'}
                </button>
              </div>

              {isEditingUrl && (
                <form onSubmit={handleSaveUrl} className="p-2.5 bg-slate-950 rounded-xl border border-slate-700 space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    URL Web App Google Apps Script:
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[10px] text-slate-500">
                      Jika membuat New Deployment, salin URL baru ke sini.
                    </p>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors shadow-sm"
                    >
                      Simpan URL
                    </button>
                  </div>
                </form>
              )}

              {urlSavedMessage && (
                <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>URL Web App berhasil disimpan! Silakan klik Periksa Hak Akses & Masuk.</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Sistem Arsip Digital v2.6</span>
              <button
                type="button"
                onClick={onOpenSetupHub}
                className="text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>Apps Script Setup Hub</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Security & Sheet Structure Footnote */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-700 space-y-2 shadow-sm">
          <div className="flex items-center space-x-1.5 text-slate-900 font-semibold">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            <span>Struktur Database Resmi (Urutan 01 s/d 06):</span>
          </div>
          <p className="leading-relaxed">
            • <code className="text-emerald-700 font-semibold">01_DATABASE_IJAZAH</code>: Master record data arsip.<br />
            • <code className="text-emerald-700 font-semibold">02_USERS_ADMIN</code>: Akun administrator Google.<br />
            • <code className="text-emerald-700 font-semibold">03_REFERENSI</code>: Master opsi dropdown unit & status (jika sebelumnya bernama <code>02_REFERENSI</code>, ganti menjadi <code>03_REFERENSI</code>).<br />
            • <code className="text-emerald-700 font-semibold">04_LOG_AKTIVITAS</code>: Audit trail aktivitas login & mutasi data.<br />
            • <code className="text-emerald-700 font-semibold">05_DASHBOARD</code> & <code className="text-emerald-700 font-semibold">06_PENCARIAN</code>: Rekap metrik & formulir filter.
          </p>
        </div>
      </div>
    </div>
  );
};
