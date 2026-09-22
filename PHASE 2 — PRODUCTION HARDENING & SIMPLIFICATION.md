## PHASE 2 — PRODUCTION HARDENING & SIMPLIFICATION

Sekarang lakukan **audit dan penyempurnaan sistem Arsip Digital Ijazah** yang telah dibuat.

Jangan membangun ulang sistem dari awal.

Jangan menambahkan fitur yang tidak diperlukan.

Tujuan tahap ini adalah:

> **SIMPLE — STABLE — SAFE — READY FOR PRODUCTION**

### 1. AUDIT SISTEM

Periksa:

* Google Form
* Google Sheets
* Google Drive
* Apps Script
* Trigger
* nomor arsip
* upload file
* pemindahan file
* rename file
* duplicate detection
* status verifikasi
* error handling

Temukan masalah sebelum menambahkan fitur.

### 2. TAMBAHKAN PENCARIAN ARSIP

Buat halaman pencarian sederhana di Google Sheets.

Admin dapat mencari berdasarkan:

* Nama
* NISN
* Nomor ijazah
* Nomor arsip

Hasil menampilkan:

* Nama
* NISN
* Unit
* Tahun lulus
* Nomor ijazah
* Nomor arsip
* Status
* Link ijazah depan
* Link ijazah belakang
* Link folder arsip

Jangan membuat UI yang rumit.

### 3. FILTER

Tambahkan filter:

* Unit
* Tahun lulus
* Status verifikasi
* Status arsip

### 4. STATUS KELENGKAPAN

Sistem harus otomatis memeriksa:

* data siswa
* NISN
* nomor ijazah
* file depan
* file belakang
* folder arsip
* nomor arsip

Hasil:

**LENGKAP**

atau

**BELUM LENGKAP**

### 5. STATUS VERIFIKASI

Gunakan hanya:

* BELUM DIVERIFIKASI
* TERVERIFIKASI
* PERLU PERBAIKAN
* DOKUMEN TIDAK SESUAI

Jangan membuat terlalu banyak status.

### 6. SOFT DELETE

Jangan menghapus record secara permanen.

Gunakan:

* AKTIF
* DIARSIPKAN
* DIBATALKAN

Data yang dibatalkan tetap tersimpan di database dan audit log.

### 7. AUDIT LOG

Catat tindakan penting:

* CREATE
* VERIFY
* UPDATE
* CANCEL
* RETRY
* ERROR

Simpan:

* timestamp
* user
* action
* record ID
* nomor arsip
* keterangan

### 8. ERROR HANDLING

Jika upload atau pemindahan file gagal:

JANGAN kehilangan data.

Status:

**ERROR — PERLU DIPERIKSA**

Sediakan fungsi:

`retryFailedArchive()`

### 9. IDEMPOTENCY

Pastikan submission yang sama tidak diproses dua kali.

Tidak boleh terjadi:

* dua nomor arsip;
* dua folder;
* dua record;
* file ganda.

### 10. KEAMANAN

Periksa kembali:

* file Drive tidak public;
* Spreadsheet tidak public;
* hanya admin yang dapat mengedit database;
* Form hanya digunakan untuk input;
* tidak ada data sensitif pada URL;
* tidak ada akses publik yang tidak diperlukan.

### 11. DASHBOARD

Pertahankan dashboard sangat sederhana.

Tampilkan hanya:

**TOTAL ARSIP**

**TERVERIFIKASI**

**BELUM DIVERIFIKASI**

**PERLU PERBAIKAN**

**BELUM LENGKAP**

Kemudian:

* jumlah per unit;
* jumlah per tahun.

Jangan membuat dashboard analitik yang berlebihan.

### 12. BACKUP

Pastikan database dapat dibackup.

Jangan menghapus backup lama secara otomatis.

### 13. PERFORMA

Optimalkan Apps Script agar:

* tidak membaca seluruh Spreadsheet berulang kali;
* tidak melakukan operasi Drive yang tidak perlu;
* menggunakan batch read/write jika memungkinkan;
* menggunakan CacheService/PropertiesService jika relevan;
* menggunakan LockService untuk nomor arsip;
* tidak membuat folder berulang kali.

Target:

> Submission normal harus diproses seefisien mungkin tanpa mengorbankan keamanan dan keakuratan.

### 14. TEST PRODUKSI

Lakukan pengujian:

1. submission normal;
2. submission unit berbeda;
3. tahun berbeda;
4. duplicate NISN;
5. duplicate nomor ijazah;
6. dua submission hampir bersamaan;
7. file tidak lengkap;
8. file gagal diproses;
9. retry;
10. verifikasi;
11. pencarian;
12. pembatalan arsip.

### 15. PRODUCTION CHECKLIST

Buat checklist akhir:

* [ ] Form aktif
* [ ] Spreadsheet aktif
* [ ] Drive aktif
* [ ] Trigger aktif
* [ ] Nomor arsip aman
* [ ] Duplicate detection aktif
* [ ] Upload aktif
* [ ] Rename aktif
* [ ] Folder otomatis aktif
* [ ] Verifikasi aktif
* [ ] Pencarian aktif
* [ ] Audit log aktif
* [ ] Backup tersedia
* [ ] Tidak ada file publik
* [ ] Tidak ada error kritis

### ATURAN

Jangan menambahkan:

* sistem pembayaran;
* absensi;
* akademik;
* AI;
* OCR;
* WhatsApp bot;
* login kompleks;
* aplikasi mobile;
* fitur yang tidak berhubungan langsung dengan arsip ijazah.

Fokus pada:

**TERIMA → SIMPAN → NOMORI → VERIFIKASI → CARI → AMANKAN**

Setelah audit selesai, berikan:

1. daftar masalah yang ditemukan;
2. perbaikan yang dilakukan;
3. fitur yang ditambahkan;
4. hasil pengujian;
5. status akhir:

**READY FOR PRODUCTION**

atau

**NOT READY FOR PRODUCTION**

Jangan menyatakan READY FOR PRODUCTION jika masih ada masalah kritis.
