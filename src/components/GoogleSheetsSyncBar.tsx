import React, { useState } from 'react';
import { GoogleSheetsSyncConfig } from '../types/archive';
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Settings, 
  X,
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';

interface GoogleSheetsSyncBarProps {
  config: GoogleSheetsSyncConfig;
  onUpdateConfig: (updated: Partial<GoogleSheetsSyncConfig>) => void;
  onSyncNow: () => Promise<void>;
  onOpenGasModal: () => void;
  totalRecordsCount: number;
}

export const GoogleSheetsSyncBar: React.FC<GoogleSheetsSyncBarProps> = ({
  config,
  onUpdateConfig,
  onSyncNow,
  onOpenGasModal,
  totalRecordsCount
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempUrl, setTempUrl] = useState(config.webAppUrl || '');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await onSyncNow();
    setIsSyncing(false);
  };

  const handleSaveUrl = () => {
    onUpdateConfig({ webAppUrl: tempUrl.trim() });
    setShowConfigModal(false);
  };

  const isConnected = Boolean(config.webAppUrl && config.status === 'CONNECTED');
  const isConfigured = Boolean(config.webAppUrl);

  return (
    <>
      {/* Sticky Top / Banner Sync Status */}
      <div className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-xs px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center space-x-2.5">
          {isConnected ? (
            <span className="flex items-center space-x-2 text-emerald-400 font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Sheets Terhubung (Live Sync)</span>
            </span>
          ) : isConfigured ? (
            <span className="flex items-center space-x-2 text-amber-400 font-semibold px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Google Sheets: Siap Disinkronkan</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2 text-slate-400 font-medium px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
              <CloudOff className="w-3.5 h-3.5 text-slate-500" />
              <span>Mode Lokal (Offline / Tersimpan di Browser)</span>
            </span>
          )}

          <span className="text-slate-700 hidden sm:inline">•</span>

          <span className="text-slate-400 hidden sm:inline text-[11px]">
            {config.lastSyncedAt ? (
              <span>Terakhir sinkron: <strong className="text-slate-200 font-mono">{config.lastSyncedAt}</strong></span>
            ) : (
              <span><strong className="text-emerald-400 font-mono">{totalRecordsCount}</strong> arsip aktif terindeks</span>
            )}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isConfigured && (
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-sm shadow-emerald-950 transition flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sinkronisasi...' : 'Tarik Data Sheets'}</span>
            </button>
          )}

          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg font-semibold text-xs border border-slate-700/80 shadow-sm transition flex items-center space-x-1.5 active:scale-95"
          >
            <Settings className="w-3 h-3 text-slate-400" />
            <span>{isConfigured ? 'Ubah URL Sinkron' : 'Hubungkan Google Sheets'}</span>
          </button>
        </div>
      </div>

      {/* Sync Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base font-['Outfit',sans-serif]">
                  Koneksi Sinkronisasi Google Sheets ↔ Web
                </h3>
              </div>
              <button 
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Hubungkan antarmuka web ini langsung ke spreadsheet Anda agar setiap pengajuan form, verifikasi ijazah, dan pembatalan arsip tersimpan langsung di Google Sheets secara 2 arah.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>URL Web App Google Apps Script:</span>
                <span className="text-[10px] text-emerald-400 font-mono">/exec</span>
              </label>
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-400 block">
                Didapat setelah mengklik <strong>Deploy ➔ New deployment ➔ Web app</strong> di editor Google Apps Script.
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-2 text-slate-300">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Belum punya URL Web App?</span>
              </div>
              <p className="text-slate-400">
                1. Buka tab <strong>Apps Script Installer</strong> di aplikasi ini.<br />
                2. Tempelkan <code className="text-emerald-300 font-mono">Code.gs</code> ke Google Apps Script.<br />
                3. Klik <strong>Deploy ➔ New deployment</strong>, pilih tipe <strong>Web app</strong>.<br />
                4. Atur <em>Execute as: Me</em> dan <em>Who has access: Anyone</em>.<br />
                5. Salin Web app URL dan tempelkan di kotak atas.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowConfigModal(false);
                  onOpenGasModal();
                }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
              >
                <span>Buka Skrip Code.gs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveUrl}
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shadow"
                >
                  Simpan & Sinkronkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
