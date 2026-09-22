import { ArchiveRecord, SystemStats, UnitType, StatusKelengkapan } from '../types/archive';

export function normalizeWhatsapp(phone: string): string {
  if (!phone) return '-';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '628' + cleaned.substring(1);
  }
  return cleaned.length >= 10 ? cleaned : phone;
}

export function generateRecordId(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const rand = Math.floor(Math.random() * 900 + 100);
  return `REC-${dateStr}-${timeStr}${rand}`;
}

export function generateArchiveNumber(
  records: ArchiveRecord[],
  unit: UnitType,
  year: number
): string {
  let normalizedUnit = unit;
  if (unit.includes('SD')) normalizedUnit = 'SD';
  else if (unit.includes('SMP')) normalizedUnit = 'SMP';
  else if (unit.includes('SMA')) normalizedUnit = 'SMA';
  else if (unit.includes('PKBM')) normalizedUnit = 'PKBM';
  else normalizedUnit = 'Lainnya';

  const prefix = `IJZ-${year}-${normalizedUnit}-`;
  let maxSeq = 0;

  for (const record of records) {
    if (record.nomorArsip && record.nomorArsip.startsWith(prefix)) {
      const parts = record.nomorArsip.split('-');
      const seqStr = parts[parts.length - 1];
      const seq = parseInt(seqStr, 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  const padded = String(nextSeq).padStart(4, '0');
  return `${prefix}${padded}`;
}

export function evaluateKelengkapan(record: Partial<ArchiveRecord>): StatusKelengkapan {
  const isNamaOk = Boolean(record.namaLengkap && record.namaLengkap.trim() && record.namaLengkap !== '-');
  const isNisnOk = Boolean(record.nisn && record.nisn.replace(/\D/g, '').length === 10);
  const isNoIjazahOk = Boolean(record.nomorIjazah && record.nomorIjazah.trim() && record.nomorIjazah !== '-');
  const isFileDepanOk = Boolean(record.fileIjazahDepan && record.fileIjazahDepan.trim() && record.fileIjazahDepan !== '-');
  const isFileBelakangOk = Boolean(record.fileIjazahBelakang && record.fileIjazahBelakang.trim() && record.fileIjazahBelakang !== '-');
  const isFolderOk = Boolean(record.folderArsip && record.folderArsip.trim() && record.folderArsip !== '-');
  const isNoArsipOk = Boolean(record.nomorArsip && record.nomorArsip.trim() && record.nomorArsip !== '-');

  if (isNamaOk && isNisnOk && isNoIjazahOk && isFileDepanOk && isFileBelakangOk && isFolderOk && isNoArsipOk) {
    return 'LENGKAP';
  }
  return 'BELUM LENGKAP';
}

export function checkDuplicateRecord(
  records: ArchiveRecord[],
  nisn: string,
  tahunLulus: number,
  unit: UnitType,
  nomorIjazah: string,
  excludeRecordId?: string
): { isDuplicate: boolean; reason: string; existingRecord?: ArchiveRecord } {
  const cleanNisn = (nisn || '').trim();
  const cleanNoIjazah = (nomorIjazah || '').trim();

  for (const r of records) {
    if (r.statusArsip === 'DIBATALKAN') continue;
    if (excludeRecordId && r.idRecord === excludeRecordId) continue;

    // Check NISN + Tahun + Unit
    if (
      cleanNisn &&
      r.nisn &&
      r.nisn.trim() === cleanNisn &&
      r.tahunLulus === tahunLulus &&
      r.unit === unit
    ) {
      return {
        isDuplicate: true,
        reason: `Kombinasi NISN (${cleanNisn}) + Tahun Lulus (${tahunLulus}) + Unit (${unit}) sudah terdaftar pada nomor arsip ${r.nomorArsip} (${r.namaLengkap}).`,
        existingRecord: r
      };
    }

    // Check Nomor Ijazah
    if (
      cleanNoIjazah &&
      cleanNoIjazah !== '-' &&
      r.nomorIjazah &&
      r.nomorIjazah.trim().toLowerCase() === cleanNoIjazah.toLowerCase()
    ) {
      return {
        isDuplicate: true,
        reason: `Nomor Seri Ijazah (${cleanNoIjazah}) sudah terdaftar sebelumnya pada arsip ${r.nomorArsip} (${r.namaLengkap}).`,
        existingRecord: r
      };
    }
  }

  return { isDuplicate: false, reason: '' };
}

export function computeSystemStats(records: ArchiveRecord[]): SystemStats {
  const activeRecords = records.filter(r => r.statusArsip !== 'DIBATALKAN');
  const dibatalkanCount = records.filter(r => r.statusArsip === 'DIBATALKAN').length;

  const stats: SystemStats = {
    totalArsip: activeRecords.length,
    totalTerverifikasi: 0,
    totalBelumVerifikasi: 0,
    totalPerluPerbaikan: 0,
    totalTidakSesuai: 0,
    totalBelumLengkap: 0,
    totalBerkasLengkap: 0,
    totalDibatalkan: dibatalkanCount,
    persentaseKelengkapan: 0,
    persentaseVerifikasi: 0,
    perUnit: {
      SD: 0,
      SMP: 0,
      SMA: 0,
      PKBM: 0,
      Lainnya: 0
    },
    perTahun: {
      2026: 0,
      2025: 0,
      2024: 0,
      2023: 0,
      2022: 0
    }
  };

  for (const r of activeRecords) {
    // 4 Status Verifikasi Resmi (Sesuai Kolom Z & Baris 4-5 Sheet Dashboard)
    if (r.statusVerifikasi === 'TERVERIFIKASI') stats.totalTerverifikasi++;
    else if (r.statusVerifikasi === 'BELUM DIVERIFIKASI') stats.totalBelumVerifikasi++;
    else if (r.statusVerifikasi === 'PERLU PERBAIKAN') stats.totalPerluPerbaikan++;
    else if (r.statusVerifikasi === 'DOKUMEN TIDAK SESUAI') stats.totalTidakSesuai++;

    // Kelengkapan Berkas (Sesuai Kolom Y & Sel F8-F9 Sheet Dashboard)
    if (r.statusKelengkapan === 'LENGKAP') {
      stats.totalBerkasLengkap++;
    } else {
      stats.totalBelumLengkap++;
    }

    // Unit (Kolom J & Baris 8-12 Sheet Dashboard)
    if (stats.perUnit[r.unit] !== undefined) {
      stats.perUnit[r.unit]++;
    } else {
      stats.perUnit.Lainnya++;
    }

    // Tahun Lulus (Kolom K & Baris 8-12 Sheet Dashboard)
    const thn = Number(r.tahunLulus);
    stats.perTahun[thn] = (stats.perTahun[thn] || 0) + 1;
  }

  // Hitung Persentase Akurat (Sama persis rumus F10 & F11)
  if (stats.totalArsip > 0) {
    stats.persentaseKelengkapan = Math.round((stats.totalBerkasLengkap / stats.totalArsip) * 100);
    stats.persentaseVerifikasi = Math.round((stats.totalTerverifikasi / stats.totalArsip) * 100);
  }

  return stats;
}

export function formatDateTimeIndo(dateStr?: string): string {
  if (!dateStr || dateStr === '-') return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch {
    return dateStr;
  }
}
