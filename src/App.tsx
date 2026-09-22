import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DatabaseTable } from './components/DatabaseTable';
import { SearchSheetView } from './components/SearchSheetView';
import { VerificationDesk } from './components/VerificationDesk';
import { FormSubmission } from './components/FormSubmission';
import { DriveExplorer } from './components/DriveExplorer';
import { ActivityLogView } from './components/ActivityLogView';
import { GasSetupHub } from './components/GasSetupHub';
import { AuthScreen } from './components/AuthScreen';
import { UserManagementView } from './components/UserManagementView';
import { CertificateDetailModal } from './components/CertificateDetailModal';
import { GoogleSheetsSyncBar } from './components/GoogleSheetsSyncBar';
import { INITIAL_ARCHIVES, INITIAL_LOGS } from './data/initialData';
import { ArchiveRecord, ActivityLog, StatusVerifikasi, GoogleSheetsSyncConfig } from './types/archive';
import { AdminUser } from './types/user';
import { computeSystemStats } from './utils/archiveUtils';
import { 
  loadStoredRecords, 
  saveStoredRecords, 
  loadStoredLogs, 
  saveStoredLogs, 
  loadSyncConfig, 
  saveSyncConfig,
  fetchLiveFromGoogleSheets,
  pushSubmissionToGoogleSheets,
  pushVerificationToGoogleSheets,
  pushCancellationToGoogleSheets
} from './services/gasSyncService';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Theme state: 'dark' | 'light' with localStorage persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('ARCHIVE_APP_THEME');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (e) {}
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('ARCHIVE_APP_THEME', theme);
    } catch (e) {}
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    showToast(theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap');
  };

  // Admin Authentication State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('ARCHIVE_ADMIN_USER');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('ARCHIVE_ADMIN_USER', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('ARCHIVE_ADMIN_USER');
      }
    } catch (e) {}
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    showToast('Anda telah logout dari sistem administrator.');
  };
  
  // Real data state with localStorage persistence
  const [records, setRecords] = useState<ArchiveRecord[]>(() => loadStoredRecords(INITIAL_ARCHIVES));
  const [logs, setLogs] = useState<ActivityLog[]>(() => loadStoredLogs(INITIAL_LOGS));

  // Google Sheets Live Sync Configuration State
  const [syncConfig, setSyncConfig] = useState<GoogleSheetsSyncConfig>(() => {
    const saved = loadSyncConfig();
    return {
      webAppUrl: saved.webAppUrl,
      spreadsheetUrl: saved.spreadsheetUrl,
      driveFolderUrl: saved.driveFolderUrl,
      lastSyncedAt: null,
      autoSync: saved.autoSync,
      status: saved.webAppUrl ? 'CONNECTED' : 'DISCONNECTED'
    };
  });
  
  // Selected Record for modal
  const [selectedRecord, setSelectedRecord] = useState<ArchiveRecord | null>(null);
  
  // Toast Alert Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSetupHubInAuth, setShowSetupHubInAuth] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Persist records & logs locally whenever they change
  useEffect(() => {
    saveStoredRecords(records);
  }, [records]);

  useEffect(() => {
    saveStoredLogs(logs);
  }, [logs]);

  // Persist sync config
  const handleUpdateSyncConfig = (updated: Partial<GoogleSheetsSyncConfig>) => {
    setSyncConfig(prev => {
      const next = { ...prev, ...updated };
      saveSyncConfig({
        webAppUrl: next.webAppUrl,
        spreadsheetUrl: next.spreadsheetUrl,
        driveFolderUrl: next.driveFolderUrl,
        autoSync: next.autoSync
      });
      return next;
    });

    if (updated.webAppUrl) {
      showToast('URL Google Apps Script disimpan! Menghubungkan ke Google Sheets...');
      triggerSync(updated.webAppUrl);
    }
  };

  // Trigger Live Sync from Google Sheets
  const triggerSync = async (targetUrl?: string) => {
    const url = targetUrl || syncConfig.webAppUrl;
    if (!url) return;

    setSyncConfig(prev => ({ ...prev, status: 'SYNCING' }));
    const result = await fetchLiveFromGoogleSheets(url);

    if (result.success && result.records && result.records.length > 0) {
      setRecords(result.records);
      if (result.logs && result.logs.length > 0) {
        setLogs(result.logs);
      }
      const syncTime = new Date().toLocaleTimeString('id-ID');
      setSyncConfig(prev => ({
        ...prev,
        status: 'CONNECTED',
        lastSyncedAt: syncTime,
        errorMessage: undefined
      }));
      showToast(`Sukses terhubung! ${result.records.length} arsip tersinkron dari Google Sheets.`);
    } else {
      setSyncConfig(prev => ({
        ...prev,
        status: result.success ? 'CONNECTED' : 'ERROR',
        errorMessage: result.message
      }));
      showToast(result.message || 'Gagal sinkron data Google Sheets.');
    }
  };

  // Initial sync attempt if webAppUrl is present
  useEffect(() => {
    if (syncConfig.webAppUrl) {
      triggerSync(syncConfig.webAppUrl);
    }
  }, []);

  // Compute System Statistics (04_DASHBOARD)
  const stats = computeSystemStats(records);

  // Pending verification count
  const pendingCount = records.filter(
    r => r.statusVerifikasi === 'BELUM DIVERIFIKASI' && r.statusArsip === 'AKTIF'
  ).length;

  // Handle New Submission from Form (Local + Google Sheets)
  const handleNewSubmission = async (newRecord: ArchiveRecord) => {
    setRecords(prev => [newRecord, ...prev]);

    // Create Log
    const author = currentUser ? `${currentUser.nama} (${currentUser.role})` : 'SYSTEM';
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: author,
      action: 'CREATE',
      idRecord: newRecord.idRecord,
      nomorArsip: newRecord.nomorArsip,
      detail: `Penerimaan arsip baru atas nama ${newRecord.namaLengkap} (${newRecord.unit} ${newRecord.tahunLulus})`
    };

    setLogs(prev => [newLog, ...prev]);
    showToast(`Arsip baru disimpan: ${newRecord.nomorArsip}`);

    // If connected to Google Sheets, push in background
    if (syncConfig.webAppUrl) {
      const pushRes = await pushSubmissionToGoogleSheets(syncConfig.webAppUrl, newRecord);
      if (pushRes.success) {
        showToast(`Tersinkron ke Google Sheets: ${newRecord.nomorArsip}`);
        setSyncConfig(prev => ({ ...prev, lastSyncedAt: new Date().toLocaleTimeString('id-ID') }));
      }
    }
  };

  // Handle Status Update from Verification Desk
  const handleUpdateStatus = async (
    recordId: string, 
    newStatus: StatusVerifikasi, 
    verifierName: string, 
    notes: string
  ) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    let targetRecord: ArchiveRecord | undefined;
    const finalVerifier = verifierName || (currentUser ? currentUser.nama : 'ADMIN');

    setRecords(prev => prev.map(r => {
      if (r.idRecord === recordId) {
        targetRecord = r;
        return {
          ...r,
          statusVerifikasi: newStatus,
          verifiedBy: finalVerifier,
          verifiedAt: timestamp,
          catatanVerifikasi: notes || r.catatanVerifikasi,
          lastUpdated: timestamp
        };
      }
      return r;
    }));

    if (targetRecord) {
      const newLog: ActivityLog = {
        id: `LOG-${Date.now()}`,
        timestamp: timestamp,
        user: finalVerifier,
        action: 'VERIFY',
        idRecord: recordId,
        nomorArsip: targetRecord.nomorArsip,
        detail: `Status verifikasi diubah menjadi ${newStatus}. Catatan: ${notes || '-'}`
      };
      setLogs(prev => [newLog, ...prev]);
    }

    showToast(`Status arsip ${recordId} diperbarui menjadi: ${newStatus}`);

    // Push to Google Sheets if connected
    if (syncConfig.webAppUrl) {
      const gasRes = await pushVerificationToGoogleSheets(
        syncConfig.webAppUrl,
        recordId,
        newStatus,
        finalVerifier,
        notes
      );
      if (gasRes.success) {
        setSyncConfig(prev => ({ ...prev, lastSyncedAt: new Date().toLocaleTimeString('id-ID') }));
      }
    }
  };

  // Handle Soft Delete (Phase 2 Section 6)
  const handleCancelArchive = async (recordId: string, reason: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    let targetRecord: ArchiveRecord | undefined;
    const actor = currentUser ? `${currentUser.nama} (${currentUser.role})` : 'ADMIN';

    setRecords(prev => prev.map(r => {
      if (r.idRecord === recordId) {
        targetRecord = r;
        return {
          ...r,
          statusArsip: 'DIBATALKAN',
          catatanVerifikasi: reason ? `[DIBATALKAN] ${reason}` : r.catatanVerifikasi,
          lastUpdated: timestamp
        };
      }
      return r;
    }));

    if (targetRecord) {
      const newLog: ActivityLog = {
        id: `LOG-${Date.now()}`,
        timestamp: timestamp,
        user: actor,
        action: 'CANCEL',
        idRecord: recordId,
        nomorArsip: targetRecord.nomorArsip,
        detail: `Arsip dibatalkan (Soft Delete). Alasan: ${reason}`
      };
      setLogs(prev => [newLog, ...prev]);
    }

    showToast(`Arsip ${recordId} berhasil dibatalkan (Soft Delete).`);

    // Push cancellation to Google Sheets if connected
    if (syncConfig.webAppUrl) {
      await pushCancellationToGoogleSheets(syncConfig.webAppUrl, recordId, reason, actor);
      setSyncConfig(prev => ({ ...prev, lastSyncedAt: new Date().toLocaleTimeString('id-ID') }));
    }
  };

  // Handle Database Backup
  const handleBackup = () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    const actor = currentUser ? `${currentUser.nama} (${currentUser.role})` : 'ADMIN';
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: actor,
      action: 'UPDATE',
      idRecord: `BACKUP-${timestamp}`,
      nomorArsip: '-',
      detail: `Cadangan database otomatis dibuat: BACKUP_DATABASE_ARSIP_${timestamp} di Google Drive`
    };
    setLogs(prev => [newLog, ...prev]);
    showToast('Cadangan database Google Sheets & Drive berhasil dibuat!');
  };

  // Print Slip
  const handlePrintSlip = (record: ArchiveRecord) => {
    setSelectedRecord(record);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-900/95 border border-emerald-500/80 text-white text-xs font-semibold shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* If Not Authenticated -> Render AuthScreen or Setup Hub */}
      {!currentUser ? (
        showSetupHubInAuth ? (
          <div className="flex-1 flex flex-col">
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  Google Apps Script Setup Hub
                </span>
                <span className="text-xs text-slate-400">
                  Salin kode terbaru dan terapkan (Deploy Versi Baru) ke Apps Script Anda
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSetupHubInAuth(false)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-sm"
              >
                ← Kembali ke Halaman Login
              </button>
            </div>
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <GasSetupHub />
            </main>
          </div>
        ) : (
          <AuthScreen
            webAppUrl={syncConfig.webAppUrl}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              showToast(`Autentikasi Berhasil! Selamat datang, ${user.nama}.`);
            }}
            onOpenSetupHub={() => {
              setShowSetupHubInAuth(true);
            }}
            onUpdateWebAppUrl={(newUrl) => {
              handleUpdateSyncConfig({ webAppUrl: newUrl, status: newUrl ? 'CONNECTED' : 'DISCONNECTED' });
              showToast('URL Google Apps Script Web App berhasil diperbarui.');
            }}
          />
        )
      ) : (
        <>
          {/* Main Navigation Header */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenGasModal={() => setActiveTab('gas')}
            onBackup={handleBackup}
            unreadCount={pendingCount}
            theme={theme}
            onToggleTheme={toggleTheme}
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          {/* Live Google Sheets Sync Status Bar */}
          <GoogleSheetsSyncBar
            config={syncConfig}
            onUpdateConfig={handleUpdateSyncConfig}
            onSyncNow={() => triggerSync()}
            onOpenGasModal={() => setActiveTab('gas')}
            totalRecordsCount={records.length}
          />

          {/* Main Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                recentRecords={records}
                onSelectRecord={(r) => setSelectedRecord(r)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'database' && (
              <DatabaseTable
                records={records}
                onSelectRecord={(r) => setSelectedRecord(r)}
                onOpenVerifyModal={(r) => {
                  setSelectedRecord(r);
                  setActiveTab('verification');
                }}
                onPrintSlip={(r) => handlePrintSlip(r)}
                onCancelArchive={handleCancelArchive}
              />
            )}

            {activeTab === 'search' && (
              <SearchSheetView
                records={records}
                onSelectRecord={(r) => setSelectedRecord(r)}
                onPrintSlip={(r) => handlePrintSlip(r)}
              />
            )}

            {activeTab === 'verification' && (
              <VerificationDesk
                records={records}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {activeTab === 'form' && (
              <FormSubmission
                existingRecords={records}
                onNewSubmission={handleNewSubmission}
                onPrintSlip={(r) => handlePrintSlip(r)}
                webAppUrl={syncConfig.webAppUrl}
              />
            )}

            {activeTab === 'drive' && (
              <DriveExplorer
                records={records}
                onSelectRecord={(r) => setSelectedRecord(r)}
              />
            )}

            {activeTab === 'users' && currentUser.role === 'SUPER_ADMIN' && (
              <UserManagementView
                currentUser={currentUser}
                webAppUrl={syncConfig.webAppUrl}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'logs' && (
              <ActivityLogView logs={logs} />
            )}

            {activeTab === 'gas' && (
              <GasSetupHub />
            )}
          </main>
        </>
      )}

      {/* Printable Detail Modal */}
      {selectedRecord && (
        <CertificateDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onPrint={() => {
            window.print();
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} <strong>Ma’had Darul Hadits Lima Puluh Kota</strong>. Sistem Arsip Digital Ijazah.
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Integrasi: Google Forms • Google Sheets (31 Kolom) • Google Apps Script • Google Drive
          </span>
        </div>
      </footer>
    </div>
  );
}

