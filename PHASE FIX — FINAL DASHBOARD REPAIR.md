# PHASE FIX — FINAL DASHBOARD REPAIR

## ARSIP DIGITAL IJAZAH — MA'HAD DARUL HADITS LIMA PULUH KOTA

Hasil audit terakhir:

```text
Dashboard Error: FAIL

#ERROR!: 21
#REF!: 0
#VALUE!: 0
#DIV/0!: 0

Dummy Data: 0
Hardcoded Statistics: 0

Database Source:
01_DATABASE_IJAZAH

Formula Validation: FAIL
Empty Database Test: PASS
Real Data Test: PASS

Production Status:
NOT READY
```

Masalah yang ditemukan:

```text
Kolom header wajib belum ditemukan:
STATUS_KELENGKAPAN
```

Dan 21 sel Dashboard menghasilkan:

```text
#ERROR!
```

## TUJUAN

Perbaiki sistem sampai:

```text
#ERROR!: 0
#REF!: 0
#VALUE!: 0
#DIV/0!: 0

Dummy Data: 0
Hardcoded Statistics: 0

Formula Validation: PASS
Empty Database Test: PASS
Real Data Test: PASS

Production Status:
READY FOR PRODUCTION
```

---

# ATURAN PALING PENTING

JANGAN membuat database baru.

JANGAN membuat Sheet baru untuk menggantikan `01_DATABASE_IJAZAH`.

JANGAN menghapus data yang sudah ada.

JANGAN mengubah nomor arsip yang sudah dibuat.

JANGAN memasukkan data dummy.

JANGAN memasukkan statistik hardcoded.

JANGAN menggunakan data contoh.

JANGAN membuat ulang seluruh sistem.

Perbaiki sistem yang sudah ada.

---

# BAGIAN 1

# TAMBAHKAN STATUS_KELENGKAPAN

Saat ini `01_DATABASE_IJAZAH` belum memiliki:

```text
STATUS_KELENGKAPAN
```

Tambahkan kolom tersebut ke `01_DATABASE_IJAZAH`.

Tetapi jangan hanya menambahkan header.

Kolom tersebut harus memiliki fungsi nyata.

---

# BAGIAN 2

# LOGIKA STATUS_KELENGKAPAN

Status harus dihitung berdasarkan data aktual.

Minimal periksa:

```text
NAMA_LENGKAP
NISN
UNIT
TAHUN_LULUS
NOMOR_IJAZAH
FILE_IJAZAH_DEPAN
FILE_IJAZAH_BELAKANG
```

Jika data wajib dan dokumen wajib tersedia:

```text
LENGKAP
```

Jika ada salah satu yang belum tersedia:

```text
BELUM LENGKAP
```

Jangan membuat status berdasarkan data dummy.

---

# BAGIAN 3

# BEDAKAN STATUS KELENGKAPAN DAN STATUS VERIFIKASI

Jangan mencampurkan:

```text
STATUS_KELENGKAPAN
```

dengan:

```text
STATUS_VERIFIKASI
```

Definisi:

### STATUS_KELENGKAPAN

Menjawab:

> Apakah data dan dokumen yang dibutuhkan sudah tersedia?

Nilai:

```text
LENGKAP
BELUM LENGKAP
```

### STATUS_VERIFIKASI

Menjawab:

> Apakah petugas sudah memeriksa dokumen tersebut?

Nilai:

```text
BELUM DIVERIFIKASI
TERVERIFIKASI
PERLU PERBAIKAN
DOKUMEN TIDAK SESUAI
```

---

# BAGIAN 4

# JANGAN GUNAKAN FORMULA YANG BERGANTUNG PADA POSISI KOLOM HARDCODE

Sebelum memperbaiki Dashboard:

Baca header row dari:

```text
01_DATABASE_IJAZAH
```

Temukan index setiap header secara dinamis.

Minimal:

```text
ID_RECORD
NOMOR_ARSIP
NAMA_LENGKAP
NISN
UNIT
TAHUN_LULUS
NOMOR_IJAZAH
FILE_IJAZAH_DEPAN
FILE_IJAZAH_BELAKANG
STATUS_KELENGKAPAN
STATUS_VERIFIKASI
STATUS_ARSIP
```

Jika salah satu tidak ditemukan:

tampilkan error yang jelas.

Jangan menggunakan kolom yang salah.

---

# BAGIAN 5

# PERBAIKI PENYEBAB #ERROR!

JANGAN hanya membungkus semua formula dengan:

```text
IFERROR(...,0)
```

Tujuan kita adalah memperbaiki akar masalah.

Cari penyebab 21 formula error.

Periksa:

1. Locale Spreadsheet.
2. Separator formula.
3. Nama Sheet.
4. Nama kolom.
5. Range.
6. Referensi sheet.
7. Formula syntax.
8. Jenis data tahun.
9. Jenis data status.
10. Formula yang dihasilkan Apps Script.

---

# BAGIAN 6

# PENTING — LOKAL GOOGLE SHEETS

Periksa locale Spreadsheet secara programatis jika memungkinkan.

Jika Spreadsheet menggunakan locale Indonesia:

Formula biasanya menggunakan separator:

```text
;
```

Jika menggunakan locale yang membutuhkan:

```text
,
```

gunakan separator yang sesuai.

Jangan menebak.

Sesuaikan formula dengan locale aktual Spreadsheet.

---

# BAGIAN 7

# GUNAKAN FORMULA SEDERHANA

Hindari formula kompleks jika tidak diperlukan.

Dashboard ini hanya membutuhkan:

```text
COUNTIF
COUNTIFS
IF
```

Gunakan formula sederhana dan stabil.

---

# BAGIAN 8

# TOTAL ARSIP

Hitung berdasarkan data nyata.

Gunakan `NOMOR_ARSIP` atau `ID_RECORD`.

Jangan menghitung header.

Jika database kosong:

```text
0
```

Jika terdapat data:

jumlah sesuai record nyata.

Jika definisi TOTAL ARSIP adalah arsip aktif, kecualikan:

```text
STATUS_ARSIP = DIBATALKAN
```

Terapkan definisi ini secara konsisten.

---

# BAGIAN 9

# TERVERIFIKASI

Hitung:

```text
STATUS_VERIFIKASI = TERVERIFIKASI
```

Harus menghasilkan angka nyata.

---

# BAGIAN 10

# BELUM DIVERIFIKASI

Hitung:

```text
STATUS_VERIFIKASI = BELUM DIVERIFIKASI
```

---

# BAGIAN 11

# PERLU PERBAIKAN

Hitung:

```text
STATUS_VERIFIKASI = PERLU PERBAIKAN
```

---

# BAGIAN 12

# DOKUMEN TIDAK SESUAI

Hitung:

```text
STATUS_VERIFIKASI = DOKUMEN TIDAK SESUAI
```

---

# BAGIAN 13

# BELUM LENGKAP

Gunakan:

```text
STATUS_KELENGKAPAN = BELUM LENGKAP
```

---

# BAGIAN 14

# JUMLAH PER UNIT

Dashboard harus menghitung data nyata:

```text
SD
SMP
SMA
PKBM
Lainnya
```

Jangan membuat angka manual.

Jika tidak ada data:

```text
0
```

---

# BAGIAN 15

# JUMLAH PER TAHUN

Hitung berdasarkan:

```text
TAHUN_LULUS
```

Untuk:

```text
2026
2025
2024
2023
2022
```

Jika tidak ada data:

```text
0
```

Jika tahun berada sebagai teks, sesuaikan formula.

Jika tahun berada sebagai angka, gunakan angka.

Periksa tipe data aktual sebelum membuat formula.

---

# BAGIAN 16

# LENGKAP

Hitung:

```text
STATUS_KELENGKAPAN = LENGKAP
```

---

# BAGIAN 17

# BELUM LENGKAP

Hitung:

```text
STATUS_KELENGKAPAN = BELUM LENGKAP
```

---

# BAGIAN 18

# PERSENTASE KELENGKAPAN

Gunakan:

```text
LENGKAP / TOTAL ARSIP
```

Jika TOTAL ARSIP = 0:

hasil:

```text
0%
```

Bukan:

```text
#DIV/0!
```

Format sebagai percentage.

---

# BAGIAN 19

# PERSENTASE VERIFIKASI

Gunakan:

```text
TERVERIFIKASI / TOTAL ARSIP
```

Jika TOTAL ARSIP = 0:

```text
0%
```

---

# BAGIAN 20

# DIBATALKAN

Hitung:

```text
STATUS_ARSIP = DIBATALKAN
```

---

# BAGIAN 21

# LOKASI FORMULA YANG HARUS DIPERBAIKI

Pastikan sel berikut tidak lagi error:

```text
A5
B5
C5
D5
E5
F5

B8
B9
B10
B11
B12

D8
D9
D10
D11
D12

F8
F9
F10
F11
F12
```

Target:

```text
semuanya VALID
```

---

# BAGIAN 22

# JANGAN GUNAKAN DATA DUMMY

Setelah perbaikan:

Pastikan:

```text
Dummy Data = 0
Hardcoded Statistics = 0
```

Jangan memasukkan record untuk membuat Dashboard terlihat bagus.

---

# BAGIAN 23

# DATABASE KOSONG

Setelah perbaikan, kosongkan hanya data TEST jika memang data test masih ada dan memang bukan data produksi.

Kemudian jalankan:

## EMPTY DATABASE TEST

Hasil yang diharapkan:

```text
TOTAL ARSIP = 0
TERVERIFIKASI = 0
BELUM DIVERIFIKASI = 0
PERLU PERBAIKAN = 0
DOKUMEN TIDAK SESUAI = 0
BELUM LENGKAP = 0

SD = 0
SMP = 0
SMA = 0
PKBM = 0
Lainnya = 0

2026 = 0
2025 = 0
2024 = 0
2023 = 0
2022 = 0

LENGKAP = 0
BELUM LENGKAP = 0
Persentase Kelengkapan = 0%
Persentase Verifikasi = 0%
DIBATALKAN = 0
```

Tidak boleh ada:

```text
#ERROR!
#REF!
#VALUE!
#DIV/0!
#N/A
```

---

# BAGIAN 24

# REAL DATA TEST

Setelah Empty Database Test PASS, gunakan submission nyata/test yang memang ditandai sebagai test.

Jangan memasukkan data siswa fiktif.

Periksa apakah:

1. Record masuk.
2. Nomor arsip terbentuk.
3. Status kelengkapan terbentuk.
4. Dashboard berubah.
5. Unit berubah.
6. Tahun berubah.
7. Status verifikasi berubah.
8. Persentase berubah.

Kemudian pastikan data test dibersihkan melalui prosedur yang benar jika bukan data produksi.

---

# BAGIAN 25

# VALIDATE DASHBOARD

Perbaiki fungsi:

```javascript
validateDashboard()
```

Output harus:

```text
====================================
HASIL AUDIT VALIDASI DASHBOARD
====================================

Dashboard Error: PASS

#ERROR!: 0
#REF!: 0
#VALUE!: 0
#DIV/0!: 0

Dummy Data: 0
Hardcoded Statistics: 0

Database Source:
01_DATABASE_IJAZAH

Formula Validation:
PASS

Empty Database Test:
PASS

Real Data Test:
PASS

Production Status:
READY FOR PRODUCTION
====================================
```

---

# BAGIAN 26

# JANGAN MENYATAKAN READY TERLALU CEPAT

Jika masih ada:

```text
#ERROR!
```

maka:

```text
Production Status: NOT READY
```

Jika:

```text
#ERROR! = 0
```

tetapi ada masalah data:

tetap:

```text
NOT READY
```

Hanya gunakan:

```text
READY FOR PRODUCTION
```

jika seluruh acceptance criteria benar-benar PASS.

---

# BAGIAN 27

# HASIL YANG WAJIB DIBERIKAN

Setelah memperbaiki sistem, jangan hanya mengatakan:

> "Sudah diperbaiki."

Tampilkan:

1. Struktur header aktual `01_DATABASE_IJAZAH`.
2. Kolom `STATUS_KELENGKAPAN` yang ditambahkan.
3. Formula yang digunakan untuk Dashboard.
4. Penyebab utama 21 `#ERROR!`.
5. Perbaikan yang dilakukan.
6. Hasil Empty Database Test.
7. Hasil Real Data Test.
8. Hasil `validateDashboard()`.
9. Status Production.

## ATURAN TERAKHIR

Jangan membuat ulang sistem.

Jangan membuat database baru.

Jangan membuat data dummy.

Jangan menyembunyikan error.

Perbaiki akar masalah.

Target akhir:

```text
#ERROR! = 0
#REF! = 0
#VALUE! = 0
#DIV/0! = 0
Dummy Data = 0
Hardcoded Statistics = 0
Formula Validation = PASS
Empty Database Test = PASS
Real Data Test = PASS
Production Status = READY FOR PRODUCTION
```
