import { ArchiveRecord, ActivityLog, StatusVerifikasi, StatusArsip } from '../types/archive';

const STORAGE_KEY_RECORDS = 'madrasah_darulhadits_records_v2';
const STORAGE_KEY_LOGS = 'madrasah_darulhadits_logs_v2';
const STORAGE_KEY_CONFIG = 'madrasah_darulhadits_gas_config_v2';

export interface StorageConfig {
  webAppUrl: string;
  spreadsheetUrl: string;
  driveFolderUrl: string;
  autoSync: boolean;
}

export function loadStoredRecords(fallback: ArchiveRecord[]): ArchiveRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load records from localStorage', e);
  }
  return fallback;
}

export function saveStoredRecords(records: ArchiveRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save records to localStorage', e);
  }
}

export function loadStoredLogs(fallback: ActivityLog[]): ActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load logs from localStorage', e);
  }
  return fallback;
}

export function saveStoredLogs(logs: ActivityLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs to localStorage', e);
  }
}

export function loadSyncConfig(): StorageConfig {
  const defaultConfig: StorageConfig = {
    webAppUrl: '',
    spreadsheetUrl: '',
    driveFolderUrl: '',
    autoSync: true
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw) return defaultConfig;
    return { ...defaultConfig, ...JSON.parse(raw) };
  } catch (e) {
    return defaultConfig;
  }
}

export function saveSyncConfig(cfg: StorageConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(cfg));
  } catch (e) {
    console.error('Failed to save sync config', e);
  }
}

/**
 * Fetch live data from deployed Google Apps Script Web App (doGet)
 */
export async function fetchLiveFromGoogleSheets(webAppUrl: string): Promise<{
  success: boolean;
  records?: ArchiveRecord[];
  logs?: ActivityLog[];
  stats?: any;
  message?: string;
}> {
  if (!webAppUrl || !webAppUrl.trim()) {
    return { success: false, message: 'URL Google Apps Script Web App belum diisi.' };
  }

  const cleanUrl = webAppUrl.trim();
  const urlWithAction = cleanUrl.includes('?') 
    ? `${cleanUrl}&action=getInitialData`
    : `${cleanUrl}?action=getInitialData`;

  try {
    const res = await fetch(urlWithAction, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    if (data.status === 'SUCCESS' && Array.isArray(data.records)) {
      return {
        success: true,
        records: data.records,
        logs: data.logs || [],
        stats: data.stats,
        message: `Berhasil menarik ${data.records.length} arsip dari Google Sheets`
      };
    } else {
      return {
        success: false,
        message: data.message || 'Format respon Apps Script tidak valid.'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Gagal tersambung ke Google Apps Script Web App.'
    };
  }
}

/**
 * Push new submission to deployed Google Apps Script Web App (doPost)
 */
export async function pushSubmissionToGoogleSheets(
  webAppUrl: string, 
  record: ArchiveRecord
): Promise<{ success: boolean; message: string; data?: any }> {
  if (!webAppUrl || !webAppUrl.trim()) {
    return { success: false, message: 'URL Web App tidak terhubung, data disimpan di memori/storage lokal.' };
  }

  try {
    const res = await fetch(webAppUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script CORS friendly
      },
      body: JSON.stringify({
        action: 'submitForm',
        record: record
      })
    });

    const result = await res.json();
    return {
      success: result.status === 'SUCCESS',
      message: result.message || 'Terkirim ke Google Sheets',
      data: result.data
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal sinkron langsung ke Apps Script: ${err.message}`
    };
  }
}

/**
 * Push status update / verification to Google Sheets (doPost)
 */
export async function pushVerificationToGoogleSheets(
  webAppUrl: string,
  recordId: string,
  newStatus: StatusVerifikasi,
  verifiedBy: string,
  notes: string
): Promise<{ success: boolean; message: string }> {
  if (!webAppUrl || !webAppUrl.trim()) {
    return { success: false, message: 'URL Web App kosong, disimpan di lokal.' };
  }

  try {
    const res = await fetch(webAppUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'verifyArchive',
        recordId,
        newStatus,
        verifiedBy,
        notes
      })
    });

    const result = await res.json();
    return {
      success: result.status === 'SUCCESS',
      message: result.message || 'Status berhasil diperbarui di Google Sheets.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal mengirim status ke Apps Script: ${err.message}`
    };
  }
}

/**
 * Push soft delete / cancellation to Google Sheets (doPost)
 */
export async function pushCancellationToGoogleSheets(
  webAppUrl: string,
  recordId: string,
  reason: string,
  cancelledBy: string
): Promise<{ success: boolean; message: string }> {
  if (!webAppUrl || !webAppUrl.trim()) {
    return { success: false, message: 'URL Web App kosong, dibatalkan secara lokal.' };
  }

  try {
    const res = await fetch(webAppUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'cancelArchive',
        recordId,
        reason,
        cancelledBy
      })
    });

    const result = await res.json();
    return {
      success: result.status === 'SUCCESS',
      message: result.message || 'Arsip berhasil dibatalkan di Google Sheets.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal mengirim pembatalan ke Apps Script: ${err.message}`
    };
  }
}

/**
 * ==============================================================================
 * ADMIN AUTHENTICATION & USER MANAGEMENT API FUNCTIONS (02_USERS_ADMIN)
 * ==============================================================================
 */

import { AdminUser, AuthResponse } from '../types/user';

/**
 * Check Google Account authentication against 02_USERS_ADMIN in Apps Script
 */
export async function authenticateWithGAS(
  webAppUrl: string, 
  email?: string
): Promise<AuthResponse> {
  if (!webAppUrl || !webAppUrl.trim()) {
    return {
      status: 'ERROR',
      message: 'URL Google Apps Script Web App belum dikonfigurasi.'
    };
  }

  const cleanUrl = webAppUrl.trim();
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  // 1. Try GET request first
  try {
    let url = cleanUrl.includes('?')
      ? `${cleanUrl}&action=authenticate`
      : `${cleanUrl}?action=authenticate`;
    
    if (cleanEmail) {
      url += `&email=${encodeURIComponent(cleanEmail)}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      // If we got a valid auth response status (SUCCESS, SETUP_REQUIRED, DENIED, DEACTIVATED)
      if (data && (data.user || data.status === 'SETUP_REQUIRED' || data.status === 'DENIED' || data.status === 'DEACTIVATED')) {
        return data;
      }
      // If response is generic fallback message, try POST before failing
      if (data && data.message && (data.message.includes('API Sistem Arsip Ijazah') || data.message.includes('aktif'))) {
        // Fallback to POST
      } else if (data && data.status) {
        return data;
      }
    }
  } catch (err: any) {
    console.warn('GET authenticate failed, attempting POST fallback:', err);
  }

  // 2. Fallback to POST request
  try {
    const postRes = await fetch(cleanUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'authenticate',
        email: cleanEmail
      })
    });

    if (postRes.ok) {
      const postData = await postRes.json();
      if (postData && (postData.user || postData.status === 'SETUP_REQUIRED' || postData.status === 'DENIED' || postData.status === 'DEACTIVATED' || postData.status === 'SUCCESS')) {
        return postData;
      }
    }
  } catch (postErr: any) {
    console.warn('POST authenticate also failed:', postErr);
  }

  return {
    status: 'ERROR',
    message: 'Google Apps Script Anda masih merespon dengan versi deployment lama atau URL Web App belum diperbarui. Silakan deploy ulang Apps Script: Manage Deployments → Edit → New Version.'
  };
}

/**
 * Fetch all administrator users from 02_USERS_ADMIN
 */
export async function fetchAdminUsersFromGAS(
  webAppUrl: string, 
  requesterEmail: string
): Promise<{ success: boolean; users?: AdminUser[]; message?: string }> {
  if (!webAppUrl || !webAppUrl.trim()) {
    return { success: false, message: 'URL Web App belum terhubung.' };
  }

  try {
    const cleanUrl = webAppUrl.trim();
    const url = cleanUrl.includes('?')
      ? `${cleanUrl}&action=getUsers&requesterEmail=${encodeURIComponent(requesterEmail.toLowerCase().trim())}`
      : `${cleanUrl}?action=getUsers&requesterEmail=${encodeURIComponent(requesterEmail.toLowerCase().trim())}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    const data = await res.json();
    if (data.status === 'SUCCESS' && Array.isArray(data.users)) {
      return { success: true, users: data.users };
    }
    return { success: false, message: data.message || 'Gagal memuat data pengguna admin.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal memuat data user dari Google Sheets.' };
  }
}

/**
 * Create a new Administrator User in 02_USERS_ADMIN
 */
export async function createAdminUserInGAS(
  webAppUrl: string,
  userData: { nama: string; email: string; role: string; unit: string; status?: string },
  requesterEmail: string
): Promise<{ success: boolean; user?: AdminUser; message: string }> {
  if (!webAppUrl || !webAppUrl.trim()) {
    return { success: false, message: 'URL Web App belum terhubung.' };
  }

  try {
    const res = await fetch(webAppUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'createUser',
        user: userData,
        requesterEmail: requesterEmail.toLowerCase().trim()
      })
    });

    const data = await res.json();
    return {
      success: data.status === 'SUCCESS',
      user: data.user,
      message: data.message || (data.status === 'SUCCESS' ? 'User admin berhasil ditambahkan.' : 'Gagal menambah user.')
    };
  } catch (err: any) {
    return { success: false, message: `Gagal menambah user ke server: ${err.message}` };
  }
}

/**
 * Update an existing Administrator User in 02_USERS_ADMIN
 */
export async function updateAdminUserInGAS(
  webAppUrl: string,
  userData: { userId: string; nama: string; role: string; unit: string; status: string },
  requesterEmail: string
): Promise<{ success: boolean; message: string }> {
  if (!webAppUrl || !webAppUrl.trim()) {
    return { success: false, message: 'URL Web App belum terhubung.' };
  }

  try {
    const res = await fetch(webAppUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'updateUser',
        user: userData,
        requesterEmail: requesterEmail.toLowerCase().trim()
      })
    });

    const data = await res.json();
    return {
      success: data.status === 'SUCCESS',
      message: data.message || (data.status === 'SUCCESS' ? 'Data admin berhasil diperbarui.' : 'Gagal memperbarui admin.')
    };
  } catch (err: any) {
    return { success: false, message: `Gagal memperbarui user: ${err.message}` };
  }
}

/**
 * Toggle Status (Aktifkan / Nonaktifkan) in 02_USERS_ADMIN
 */
export async function toggleAdminUserStatusInGAS(
  webAppUrl: string,
  userId: string,
  newStatus: 'AKTIF' | 'NONAKTIF',
  requesterEmail: string
): Promise<{ success: boolean; message: string }> {
  if (!webAppUrl || !webAppUrl.trim()) {
    return { success: false, message: 'URL Web App belum terhubung.' };
  }

  try {
    const res = await fetch(webAppUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: newStatus === 'AKTIF' ? 'reactivateUser' : 'deactivateUser',
        userId: userId,
        requesterEmail: requesterEmail.toLowerCase().trim()
      })
    });

    const data = await res.json();
    return {
      success: data.status === 'SUCCESS',
      message: data.message || (data.status === 'SUCCESS' ? `Status user berhasil diubah menjadi ${newStatus}.` : 'Gagal mengubah status.')
    };
  } catch (err: any) {
    return { success: false, message: `Gagal mengubah status di server: ${err.message}` };
  }
}

/**
 * Setup First Super Admin in 02_USERS_ADMIN when sheet is pristine/empty
 */
export async function setupFirstAdminInGAS(
  webAppUrl: string,
  adminData: { nama: string; email: string; unit?: string }
): Promise<{ success: boolean; user?: AdminUser; message: string }> {
  if (!webAppUrl || !webAppUrl.trim()) {
    return { success: false, message: 'URL Web App belum terhubung.' };
  }

  try {
    const res = await fetch(webAppUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'setupFirstAdmin',
        nama: adminData.nama,
        email: adminData.email.toLowerCase().trim(),
        unit: adminData.unit || 'SEMUA'
      })
    });

    const data = await res.json();
    return {
      success: data.status === 'SUCCESS',
      user: data.user,
      message: data.message || 'Inisialisasi Super Admin pertama berhasil.'
    };
  } catch (err: any) {
    return { success: false, message: `Gagal inisialisasi Super Admin: ${err.message}` };
  }
}

/**
 * Run Admin Authentication & User Management Audit
 */
export async function runAdminAuthAudit(
  webAppUrl: string
): Promise<{ success: boolean; auditReport?: any; message?: string }> {
  if (!webAppUrl || !webAppUrl.trim()) {
    return { success: false, message: 'URL Web App belum terhubung.' };
  }

  try {
    const cleanUrl = webAppUrl.trim();
    const url = cleanUrl.includes('?')
      ? `${cleanUrl}&action=auditAuth`
      : `${cleanUrl}?action=auditAuth`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    const data = await res.json();
    return {
      success: data.status === 'SUCCESS',
      auditReport: data.auditReport,
      message: data.message
    };
  } catch (err: any) {
    return { success: false, message: `Gagal menjalankan audit autentikasi: ${err.message}` };
  }
}

