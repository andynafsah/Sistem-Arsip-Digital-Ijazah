# FIX — DASHBOARD ARSIP DIGITAL IJAZAH

## GOOGLE SHEETS — REAL DATA ONLY

Dashboard saat ini menampilkan:

```text
TOTAL ARSIP              #ERROR!
TERVERIFIKASI            #ERROR!
BELUM DIVERIFIKASI       #ERROR!
PERLU PERBAIKAN          #ERROR!
DOKUMEN TIDAK SESUAI     #ERROR!
BELUM LENGKAP            #ERROR!

JUMLAH PER UNIT
SD                       #ERROR!
SMP                      #ERROR!
SMA                      #ERROR!
PKBM                      #ERROR!
Lainnya                  #ERROR!

JUMLAH PER TAHUN
2026                     #ERROR!
2025                     #ERROR!
2024                     #ERROR!
2023                     #ERROR!
2022                     #ERROR!

INTEGRITAS & KELENGKAPAN
LENGKAP                  #ERROR!
BELUM LENGKAP             #ERROR!
Persentase Kelengkapan   #ERROR!
Persentase Verifikasi    #ERROR!
DIBATALKAN               #ERROR!
```

## TUJUAN

Perbaiki Dashboard sampai **tidak ada `#ERROR!`**, dengan ketentuan:

> **SEMUA ANGKA HARUS BERASAL DARI DATA NYATA DI `01_DATABASE_IJAZAH`.**

Jangan memasukkan angka dummy.

Jangan mengganti `#ERROR!` dengan angka manual.

Jangan menggunakan data contoh.

---

# 1. AUDIT STRUKTUR DATABASE TERLEBIH DAHULU

Sebelum memperbaiki formula, periksa sheet:

**01_DATABASE_IJAZAH**

Identifikasi posisi kolom sebenarnya berdasarkan header.

Minimal cari kolom:

```text
NOMOR_ARSIP
NAMA_LENGKAP
NISN
UNIT
TAHUN_LULUS
STATUS_VERIFIKASI
KELENGKAPAN
STATUS_ARSIP
```

JANGAN mengasumsikan posisi kolom.

Formula harus menggunakan posisi kolom yang benar-benar ditemukan.

Jika nama header berbeda, sesuaikan formula dengan header aktual.

---

# 2. JANGAN MENGGUNAKAN FORMULA YANG BERISIKO #ERROR!

Periksa apakah formula sebelumnya menggunakan:

* QUERY dengan sintaks salah;
* ARRAYFORMULA yang salah;
* COUNTIF terhadap range yang salah;
* COUNTIFS dengan jumlah range tidak sama;
* referensi sheet yang salah;
* referensi kolom yang tidak ada;
* formula yang menggunakan nama sheet tanpa tanda `'`;
* formula yang tidak kompatibel dengan Google Sheets;
* formula dengan separator yang tidak sesuai locale.

Gunakan formula Google Sheets yang sederhana dan stabil.

---

# 3. GUNAKAN DATABASE SEBAGAI SUMBER DATA

Semua statistik harus mengambil data dari:

```text
'01_DATABASE_IJAZAH'
```

Jangan menggunakan data dari frontend.

Jangan membuat database statistik kedua.

---

# 4. TOTAL ARSIP

Hitung jumlah record arsip nyata.

Gunakan kolom `ID_RECORD` atau `NOMOR_ARSIP` yang tidak kosong.

Konsep:

```text
COUNTIF(range,"<>")
```

tetapi pastikan header tidak ikut dihitung.

Jika data mulai dari row 2:

```text
=COUNTIF('01_DATABASE_IJAZAH'!B2:B,"<>")
```

Sesuaikan kolom B dengan posisi aktual `NOMOR_ARSIP`.

Jika status `DIBATALKAN` harus dikecualikan dari TOTAL ARSIP aktif, gunakan logika yang sesuai:

```text
COUNTIFS(NOMOR_ARSIP_RANGE,"<>",STATUS_ARSIP_RANGE,"<>DIBATALKAN")
```

Tentukan perilaku ini berdasarkan definisi sistem dan terapkan secara konsisten.

---

# 5. TERVERIFIKASI

Hitung:

```text
STATUS_VERIFIKASI = TERVERIFIKASI
```

Gunakan:

```text
=COUNTIF(STATUS_VERIFIKASI_RANGE,"TERVERIFIKASI")
```

---

# 6. BELUM DIVERIFIKASI

Gunakan:

```text
=COUNTIF(STATUS_VERIFIKASI_RANGE,"BELUM DIVERIFIKASI")
```

---

# 7. PERLU PERBAIKAN

Gunakan:

```text
=COUNTIF(STATUS_VERIFIKASI_RANGE,"PERLU PERBAIKAN")
```

---

# 8. DOKUMEN TIDAK SESUAI

Gunakan:

```text
=COUNTIF(STATUS_VERIFIKASI_RANGE,"DOKUMEN TIDAK SESUAI")
```

---

# 9. BELUM LENGKAP

Gunakan:

```text
=COUNTIF(KELENGKAPAN_RANGE,"BELUM LENGKAP")
```

---

# 10. JUMLAH PER UNIT

Untuk:

```text
SD
SMP
SMA
PKBM
Lainnya
```

gunakan:

```text
=COUNTIF(UNIT_RANGE,"SD")
```

```text
=COUNTIF(UNIT_RANGE,"SMP")
```

```text
=COUNTIF(UNIT_RANGE,"SMA")
```

```text
=COUNTIF(UNIT_RANGE,"PKBM")
```

Untuk Lainnya gunakan formula yang benar-benar menghitung nilai selain unit utama.

Jangan membuat angka manual.

---

# 11. JUMLAH PER TAHUN

Untuk:

```text
2026
2025
2024
2023
2022
```

gunakan:

```text
=COUNTIF(TAHUN_LULUS_RANGE,2026)
```

dan seterusnya.

Pastikan formula tetap bekerja jika tahun disimpan sebagai:

* angka;
* atau teks.

Jika data tahun berupa teks, gunakan `"2026"`.

Periksa format aktual sebelum menentukan formula.

---

# 12. LENGKAP

Gunakan:

```text
=COUNTIF(KELENGKAPAN_RANGE,"LENGKAP")
```

---

# 13. BELUM LENGKAP

Gunakan:

```text
=COUNTIF(KELENGKAPAN_RANGE,"BELUM LENGKAP")
```

---

# 14. PERSENTASE KELENGKAPAN

Formula:

```text
LENGKAP / TOTAL ARSIP × 100
```

Tetapi jika total arsip = 0:

JANGAN menghasilkan `#DIV/0!`.

Gunakan:

```text
=IF(TOTAL=0,0,LENGKAP/TOTAL)
```

Format sebagai percentage.

Jika belum ada data:

```text
0%
```

bukan error.

---

# 15. PERSENTASE VERIFIKASI

Formula:

```text
TERVERIFIKASI / TOTAL ARSIP
```

Jika total = 0:

```text
0%
```

Jangan menghasilkan error.

---

# 16. DIBATALKAN

Hitung:

```text
STATUS_ARSIP = DIBATALKAN
```

Gunakan:

```text
=COUNTIF(STATUS_ARSIP_RANGE,"DIBATALKAN")
```

---

# 17. JANGAN GUNAKAN ANGKA HARDCODE

DILARANG:

```text
125
98
27
10
```

sebagai nilai dashboard.

Semua harus formula atau hasil perhitungan data aktual.

---

# 18. KONSISTENSI DEFINISI

Tetapkan definisi berikut:

### TOTAL ARSIP

Jumlah arsip yang benar-benar tercatat dan aktif.

### TERVERIFIKASI

STATUS_VERIFIKASI = TERVERIFIKASI

### BELUM DIVERIFIKASI

STATUS_VERIFIKASI = BELUM DIVERIFIKASI

### PERLU PERBAIKAN

STATUS_VERIFIKASI = PERLU PERBAIKAN

### DOKUMEN TIDAK SESUAI

STATUS_VERIFIKASI = DOKUMEN TIDAK SESUAI

### BELUM LENGKAP

KELENGKAPAN = BELUM LENGKAP

### DIBATALKAN

STATUS_ARSIP = DIBATALKAN

Jangan mencampur `STATUS_VERIFIKASI` dengan `STATUS_ARSIP`.

---

# 19. JIKA DATABASE KOSONG

Jika tidak ada data:

```text
TOTAL ARSIP = 0
TERVERIFIKASI = 0
BELUM DIVERIFIKASI = 0
PERLU PERBAIKAN = 0
DOKUMEN TIDAK SESUAI = 0
BELUM LENGKAP = 0
```

Unit:

```text
SD = 0
SMP = 0
SMA = 0
PKBM = 0
Lainnya = 0
```

Tahun:

```text
2026 = 0
2025 = 0
2024 = 0
2023 = 0
2022 = 0
```

Kelengkapan:

```text
LENGKAP = 0
BELUM LENGKAP = 0
```

Persentase:

```text
0%
```

Tidak boleh ada:

```text
#ERROR!
#DIV/0!
#VALUE!
#REF!
#N/A
```

---

# 20. TERAKHIR DISINKRONKAN

Bagian:

```text
Terakhir Disinkronkan:
22/09/2026 20:14:10
```

tidak boleh hardcode.

Ambil dari timestamp sinkronisasi yang benar-benar dijalankan.

Jika sistem memang menggunakan Apps Script, gunakan timestamp dari proses sinkronisasi.

Format:

```text
dd/MM/yyyy HH:mm:ss
```

Timezone:

```text
Asia/Jakarta
```

---

# 21. BUAT FUNGSI VALIDASI DASHBOARD

Tambahkan fungsi Apps Script:

```javascript
validateDashboard()
```

Fungsi harus memeriksa:

* sheet database tersedia;
* header tersedia;
* kolom yang diperlukan tersedia;
* formula dashboard valid;
* tidak ada `#ERROR!`;
* tidak ada `#REF!`;
* tidak ada `#VALUE!`;
* tidak ada `#DIV/0!`.

Jika ditemukan masalah, tampilkan detailnya.

---

# 22. HEADER VALIDATION

Sistem jangan bergantung pada nomor kolom tetap.

Cari index berdasarkan nama header.

Contoh:

```javascript
const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

const unitIndex = headers.indexOf("UNIT");
const tahunIndex = headers.indexOf("TAHUN_LULUS");
const statusIndex = headers.indexOf("STATUS_VERIFIKASI");
```

Jika header tidak ditemukan:

berikan error yang jelas.

Jangan diam-diam menggunakan kolom yang salah.

---

# 23. LOKALISASI FORMULA

Periksa locale Google Spreadsheet.

Jika spreadsheet menggunakan locale Indonesia dan formula membutuhkan separator `;`, gunakan separator yang sesuai.

Jika menggunakan locale yang menerima `,`, gunakan `,`.

Jangan mengasumsikan locale.

Periksa spreadsheet terlebih dahulu.

---

# 24. JANGAN MERUSAK DATA

Saat memperbaiki Dashboard:

JANGAN:

* menghapus data database;
* menghapus record;
* mengubah nomor arsip;
* mengubah file Drive;
* mengubah NISN;
* mengubah data siswa.

Perbaikan hanya pada formula/dashboard kecuali memang ditemukan kesalahan struktur yang harus diperbaiki.

---

# 25. HASIL AKHIR

Dashboard harus menjadi seperti:

```text
📊 DASHBOARD ARSIP DIGITAL IJAZAH

Ma'had Darul Hadits Lima Puluh Kota
Terakhir Disinkronkan: [TIMESTAMP NYATA]

TOTAL ARSIP       0
TERVERIFIKASI     0
BELUM DIVERIFIKASI 0
PERLU PERBAIKAN   0
DOKUMEN TIDAK SESUAI 0
BELUM LENGKAP     0

JUMLAH PER UNIT

SD       0
SMP      0
SMA      0
PKBM     0
Lainnya  0

JUMLAH PER TAHUN

2026     0
2025     0
2024     0
2023     0
2022     0

INTEGRITAS & KELENGKAPAN

LENGKAP                 0
BELUM LENGKAP           0
Persentase Kelengkapan  0%
Persentase Verifikasi   0%
DIBATALKAN              0
```

Jika nantinya ada 15 data nyata, angka berubah menjadi hasil perhitungan 15 data tersebut.

---

# 26. FINAL ACCEPTANCE TEST

Jalankan test berikut.

### TEST A — DATABASE KOSONG

Pastikan semua statistik = 0 dan tidak ada error.

### TEST B — TAMBAH 1 DATA

Masukkan satu data nyata.

Pastikan:

* Total Arsip bertambah;
* unit bertambah;
* tahun bertambah;
* status bertambah;
* kelengkapan bertambah.

### TEST C — VERIFIKASI

Ubah satu data menjadi:

`TERVERIFIKASI`

Pastikan:

* TERVERIFIKASI +1;
* BELUM DIVERIFIKASI -1;
* Persentase Verifikasi berubah.

### TEST D — PERBAIKAN

Ubah status menjadi:

`PERLU PERBAIKAN`

Pastikan statistik berubah.

### TEST E — BATAL

Ubah:

`STATUS_ARSIP = DIBATALKAN`

Pastikan jumlah DIBATALKAN bertambah dan definisi TOTAL ARSIP tetap konsisten.

### TEST F — DATABASE KOSONG KEMBALI

Jika semua data dihapus melalui prosedur yang sah, dashboard harus kembali ke 0 tanpa error.

---

# 27. HASIL YANG WAJIB DILAPORKAN

Setelah selesai, berikan:

```text
Dashboard Error:
PASS / FAIL

#ERROR!:
0

#REF!:
0

#VALUE!:
0

#DIV/0!:
0

Dummy Data:
0

Hardcoded Statistics:
0

Database Source:
01_DATABASE_IJAZAH

Formula Validation:
PASS / FAIL

Empty Database Test:
PASS / FAIL

Real Data Test:
PASS / FAIL

Production Status:
READY / NOT READY
```

## ATURAN TERAKHIR

Jangan menyembunyikan error dengan:

```text
IFERROR(formula,0)
```

tanpa terlebih dahulu memperbaiki penyebab error.

`IFERROR` hanya boleh digunakan untuk kondisi yang memang secara logis berarti **0**, misalnya persentase ketika total data = 0.

Saya ingin **akar masalah formula diperbaiki**, bukan sekadar error disembunyikan.

Dashboard harus benar-benar menghitung data dari:

**01_DATABASE_IJAZAH**

dan tidak boleh menggunakan data dummy.
