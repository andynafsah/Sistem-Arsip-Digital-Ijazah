export * from './user';
export type UnitType = 'SD' | 'SMP' | 'SMA' | 'PKBM' | 'Lainnya';


export type StatusDokumen = 
  | 'Ijazah asli tersedia'
  | 'Ijazah rusak'
  | 'Ijazah hilang'
  | 'Surat keterangan pengganti'
  | 'Lainnya';

export type StatusKelengkapan = 'LENGKAP' | 'BELUM LENGKAP';

export type StatusVerifikasi = 
  | 'BELUM DIVERIFIKASI'
  | 'TERVERIFIKASI'
  | 'PERLU PERBAIKAN'
  | 'DOKUMEN TIDAK SESUAI';

export type StatusArsip = 'AKTIF' | 'DIARSIPKAN' | 'DIBATALKAN';

export type LogAction = 'CREATE' | 'VERIFY' | 'UPDATE' | 'CANCEL' | 'RETRY' | 'ERROR';

export interface ArchiveRecord {
  idRecord: string;             // REC-YYYYMMDD-XXXXXX
  nomorArsip: string;           // IJZ-YYYY-UNIT-XXXX
  timestamp: string;            // ISO or formatted string
  namaLengkap: string;
  nisn: string;
  nis: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  unit: UnitType;
  tahunLulus: number;
  namaAyahWali: string;
  namaIbuWali: string;
  nomorWhatsapp: string;
  alamat: string;
  nomorIjazah: string;
  tanggalTerbitIjazah: string;
  tahunIjazah: number;
  nomorUjian?: string;
  statusDokumen: StatusDokumen;
  keteranganTambahan?: string;
  fileIjazahDepan: string;      // URL or preview data
  fileIjazahBelakang: string;   // URL or preview data
  filePendukung?: string;       // URL or preview data
  folderArsip: string;          // Drive path / URL
  statusKelengkapan: StatusKelengkapan;
  statusVerifikasi: StatusVerifikasi;
  verifiedBy?: string;
  verifiedAt?: string;
  catatanVerifikasi?: string;
  statusArsip: StatusArsip;
  lastUpdated: string;
  isDuplicateWarning?: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'VERIFY' | 'UPDATE' | 'CANCEL' | 'RETRY' | 'ERROR';
  idRecord: string;
  nomorArsip: string;
  detail: string;
}

export interface SystemStats {
  totalArsip: number;
  totalTerverifikasi: number;
  totalBelumVerifikasi: number;
  totalPerluPerbaikan: number;
  totalTidakSesuai: number;
  totalBelumLengkap: number;
  totalBerkasLengkap: number;
  totalDibatalkan: number;
  persentaseKelengkapan: number;
  persentaseVerifikasi: number;
  perUnit: Record<UnitType, number>;
  perTahun: Record<number, number>;
}

export interface GasTestResult {
  testId: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  details?: string;
  executionTimeMs?: number;
}

export interface GoogleSheetsSyncConfig {
  webAppUrl: string;
  spreadsheetUrl: string;
  driveFolderUrl: string;
  lastSyncedAt: string | null;
  autoSync: boolean;
  status: 'DISCONNECTED' | 'CONNECTED' | 'SYNCING' | 'ERROR';
  errorMessage?: string;
}
