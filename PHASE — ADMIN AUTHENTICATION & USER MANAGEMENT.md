# PHASE — ADMIN AUTHENTICATION & USER MANAGEMENT

## DIGITAL ARCHIVE IJAZAH — MA'HAD DARUL HADITS 50 KOTA

Anda bertindak sebagai SENIOR GOOGLE APPS SCRIPT + GOOGLE SHEETS + FRONTEND DEVELOPER.

Saya memiliki sistem:

**FORMULIR ARSIP DIGITAL IJAZAH PESERTA DIDIK MA'HAD DARUL HADITS 50 KOTA**

dengan arsitektur:

Google Form
→ Google Sheets
→ Google Apps Script
→ Google Drive
→ Dashboard Web App

Sistem ini sudah berjalan. JANGAN membuat ulang sistem dari awal.

Tugas Anda adalah **mengimplementasikan fitur LOGIN ADMIN DASHBOARD dan DATABASE USER ADMIN yang tersinkron langsung dengan Google Sheets.**

==================================================

## 1. TUJUAN

==================================================

Buat sistem autentikasi Dashboard yang:

1. Aman.
2. Sederhana.
3. Tidak menggunakan username/password buatan sendiri.
4. Menggunakan identitas Google Account/email sebagai identitas administrator.
5. Data user admin tersimpan di Google Sheets.
6. Frontend Dashboard membaca hak akses dari Apps Script.
7. Tidak ada dummy user.
8. Tidak ada akun admin palsu.
9. Tidak ada hardcoded user admin di frontend.
10. Tidak menggunakan localStorage sebagai sumber autentikasi.
11. Google Sheets menjadi sumber data user admin.
12. Apps Script menjadi pihak yang melakukan validasi akses.
13. Semua perubahan user tercatat dalam audit log.

==================================================

## 2. JANGAN MENGGANGGU SISTEM YANG SUDAH ADA

==================================================

Jangan menghapus:

* 01_DATABASE_IJAZAH
* Dashboard yang sudah ada
* Google Form
* Google Drive archive
* proses upload file
* proses generate nomor arsip
* status verifikasi
* status kelengkapan
* status arsip
* audit log yang sudah ada
* fungsi existing yang masih digunakan

Pertahankan seluruh fungsi existing.

Jika perlu perubahan schema, lakukan secara kompatibel.

Jangan membuat database kedua yang tidak diperlukan.

==================================================

## 3. BUAT SHEET USER ADMIN

==================================================

Buat satu sheet khusus:

`02_USERS_ADMIN`

Sheet harus dibuat otomatis oleh fungsi setup jika belum ada.

HEADER BARIS 1 WAJIB:

A = USER_ID
B = NAMA
C = EMAIL
D = ROLE
E = STATUS
F = UNIT
G = CREATED_AT
H = UPDATED_AT
I = LAST_LOGIN
J = CREATED_BY

Jangan menggunakan kolom tambahan tanpa alasan teknis.

==================================================

## 4. ATURAN DATA USER

==================================================

EMAIL adalah identitas utama user.

EMAIL harus:

* lowercase
* trim whitespace
* unik
* tidak boleh duplikat

USER_ID dibuat otomatis.

Format:

`USR-000001`
`USR-000002`
`USR-000003`

Tidak boleh ada USER_ID duplikat.

==================================================

## 5. ROLE

==================================================

Gunakan role sederhana:

`SUPER_ADMIN`

`ADMIN_TU`

`OPERATOR`

Hak akses:

SUPER_ADMIN:

* melihat seluruh dashboard
* mencari arsip
* melihat detail arsip
* verifikasi arsip
* mengubah status
* mengarsipkan data
* mengelola user admin
* melihat audit log
* menjalankan sinkronisasi
* melihat status sistem

ADMIN_TU:

* melihat dashboard
* mencari arsip
* melihat detail
* melakukan verifikasi
* memperbaiki data yang diizinkan
* melihat data sesuai kewenangan
* tidak boleh mengelola SUPER_ADMIN

OPERATOR:

* melihat data yang diperlukan
* melakukan pekerjaan operasional yang diizinkan
* tidak boleh mengelola user
* tidak boleh mengubah pengaturan sistem kritis

Jangan membuat role tambahan kecuali benar-benar diperlukan.

==================================================

## 6. STATUS USER

==================================================

Gunakan hanya:

`AKTIF`

`NONAKTIF`

User dengan status:

`NONAKTIF`

tidak boleh masuk Dashboard.

==================================================

## 7. TIDAK BOLEH ADA PASSWORD DI SHEET

==================================================

SANGAT PENTING:

Jangan membuat kolom:

PASSWORD

PASSWORD_HASH

PIN

SECRET

atau password lainnya.

Jangan menyimpan password Google.

Jangan meminta administrator membuat password aplikasi.

Identitas administrator berasal dari Google Account/email yang digunakan untuk mengakses Web App.

==================================================

## 8. VALIDASI SERVER-SIDE

==================================================

Jangan hanya melakukan:

if email exists di frontend.

Itu TIDAK AMAN.

Setiap request penting harus diverifikasi di Apps Script.

Contoh konsep:

getCurrentUser()

→ mendapatkan identitas user dari sesi Web App

→ normalisasi email

→ cari EMAIL di `02_USERS_ADMIN`

→ cek STATUS = AKTIF

→ ambil ROLE

→ cek hak akses

→ baru proses request.

Frontend hanya menampilkan UI berdasarkan hasil server.

==================================================

## 9. JANGAN HARDCODE EMAIL ADMIN DI FRONTEND

==================================================

JANGAN membuat seperti:

const ADMIN_EMAIL = "[admin@gmail.com](mailto:admin@gmail.com)";

atau:

const USERS = [...]

di frontend.

Tidak boleh.

Semua user harus berasal dari:

`02_USERS_ADMIN`

melalui Apps Script.

==================================================

## 10. FUNGSI APPS SCRIPT

==================================================

Tambahkan atau sesuaikan fungsi berikut:

`setupAdminUsersSheet()`

`getCurrentUser()`

`authenticateUser()`

`getAdminUserByEmail()`

`getAdminUsers()`

`createAdminUser()`

`updateAdminUser()`

`deactivateAdminUser()`

`reactivateAdminUser()`

`updateLastLogin()`

`checkPermission()`

`requireAdminAccess()`

`requireRole()`

`logAdminActivity()`

Gunakan fungsi existing jika fungsi dengan tujuan sama sudah tersedia.

Jangan membuat fungsi duplikat.

==================================================

## 11. USER LOGIN

==================================================

Ketika admin membuka Dashboard:

Tampilkan:

**DASHBOARD ARSIP DIGITAL IJAZAH**

dan status:

`Memeriksa akun Google...`

Apps Script memeriksa email pengguna.

Jika email ditemukan dan:

STATUS = AKTIF

maka:

→ login berhasil
→ ambil nama
→ ambil role
→ ambil unit
→ tampilkan Dashboard.

Contoh:

`Selamat datang, Admin TU`

`Role: ADMIN_TU`

==================================================

## 12. USER TIDAK TERDAFTAR

==================================================

Jika email Google tidak terdapat pada:

`02_USERS_ADMIN`

jangan membuat akun otomatis.

Jangan memasukkan email otomatis ke Sheet.

Tampilkan:

**AKSES DITOLAK**

**Akun Google Anda belum terdaftar sebagai administrator sistem.**

Silakan hubungi Super Admin/TU.

==================================================

## 13. USER NONAKTIF

==================================================

Jika email ada tetapi:

STATUS = NONAKTIF

tampilkan:

**AKUN DINONAKTIFKAN**

Anda tidak memiliki akses ke Dashboard Arsip Digital Ijazah.

==================================================

## 14. USER MANAGEMENT

==================================================

SUPER_ADMIN mendapatkan menu:

**Manajemen User**

Tampilkan tabel dari `02_USERS_ADMIN`.

Kolom:

* USER_ID
* NAMA
* EMAIL
* ROLE
* UNIT
* STATUS
* LAST_LOGIN

Fitur:

* Tambah User
* Edit User
* Aktifkan
* Nonaktifkan

Tidak ada:

* Password
* Reset Password

==================================================

## 15. TAMBAH USER

==================================================

Form:

Nama
Email Google
Role
Unit
Status

Default:

STATUS = AKTIF

Email harus dinormalisasi:

lowercase + trim.

Sebelum menyimpan:

cek apakah email sudah ada.

Jika sudah ada:

tolak.

Tampilkan:

`Email sudah terdaftar.`

==================================================

## 16. PENCEGAHAN DUPLIKASI

==================================================

Gunakan:

LockService

ketika:

* membuat USER_ID
* menambah user
* mengubah user

Pastikan dua administrator yang melakukan perubahan bersamaan tidak menghasilkan USER_ID sama.

==================================================

## 17. PROTEKSI SUPER ADMIN

==================================================

SUPER_ADMIN tidak boleh dinonaktifkan sembarangan.

Minimal harus selalu ada:

1 SUPER_ADMIN aktif.

Jika mencoba menonaktifkan satu-satunya SUPER_ADMIN aktif:

TOLAK.

Tampilkan:

`Minimal satu SUPER_ADMIN aktif harus tersedia.`

SUPER_ADMIN juga tidak boleh dihapus secara permanen.

Gunakan NONAKTIF sebagai soft-disable.

==================================================

## 18. LAST LOGIN

==================================================

Ketika login berhasil:

kolom:

`LAST_LOGIN`

diperbarui otomatis.

Gunakan timestamp timezone:

`Asia/Jakarta`

Format:

`dd/MM/yyyy HH:mm:ss`

==================================================

## 19. AUDIT LOG

==================================================

Setiap aktivitas admin penting dicatat.

Minimal:

LOGIN_SUCCESS
LOGIN_DENIED
USER_CREATED
USER_UPDATED
USER_ACTIVATED
USER_DEACTIVATED
ARCHIVE_VIEWED
ARCHIVE_VERIFIED
ARCHIVE_UPDATED
ARCHIVE_ARCHIVED

Jika sistem sudah memiliki sheet audit log, gunakan sheet tersebut.

Jangan membuat audit log kedua jika tidak diperlukan.

==================================================

## 20. UNIT

==================================================

Unit user mengikuti unit yang sudah digunakan sistem.

Jika sistem memiliki:

SD
SMP
SMA
PKBM
LAINNYA

gunakan nilai tersebut.

Jangan membuat nama unit baru.

SUPER_ADMIN dapat memiliki:

`SEMUA`

Jika ADMIN_TU atau OPERATOR memiliki unit tertentu, akses data mengikuti unit tersebut jika fitur scope unit memang sudah diterapkan.

==================================================

## 21. SINKRONISASI FRONTEND

==================================================

Frontend Dashboard tidak boleh mempunyai data user sendiri.

Frontend harus mengambil:

Nama
Email
Role
Unit
Status

dari Apps Script.

Alur:

Frontend
↓
Apps Script
↓
02_USERS_ADMIN
↓
response JSON
↓
Frontend

Tidak boleh:

Frontend
↓
localStorage user
↓
anggap login valid.

==================================================

## 22. SESSION

==================================================

Gunakan mekanisme sesi yang aman sesuai kemampuan Google Apps Script Web App.

Jangan membuat token sederhana yang hanya disimpan di frontend dan dianggap valid tanpa pemeriksaan server.

Untuk setiap operasi sensitif:

Apps Script wajib memeriksa user yang sedang melakukan request.

==================================================

## 23. LOGOUT

==================================================

Sediakan tombol:

**Logout**

Setelah logout:

* hapus state frontend
* kembali ke halaman akses/login
* jangan menghapus data Google Sheet
* jangan menghapus arsip
* jangan mengubah user menjadi NONAKTIF

==================================================

## 24. DASHBOARD HEADER

==================================================

Setelah login tampilkan:

`DASHBOARD ARSIP DIGITAL IJAZAH`

Nama:

`[Nama User]`

Email:

`[Email]`

Role:

`[Role]`

Unit:

`[Unit]`

Tombol:

`Logout`

==================================================

## 25. DATA DATABASE HARUS REAL

==================================================

SANGAT PENTING:

Jangan membuat:

* dummy users
* fake users
* sample users
* mock users
* demo users
* fake email
* hardcoded statistics

Jangan mengisi:

`02_USERS_ADMIN`

dengan akun contoh.

Jika sheet masih kosong:

tampilkan:

`Belum ada user admin yang terdaftar.`

Bukan membuat akun palsu.

==================================================

## 26. FIRST ADMIN

==================================================

Karena sistem membutuhkan minimal satu SUPER_ADMIN, buat mekanisme setup admin pertama yang AMAN.

Jangan otomatis membuat akun dengan email contoh.

Gunakan email Google administrator yang benar-benar sedang melakukan setup, lalu minta konfirmasi eksplisit sebelum membuatnya sebagai:

`SUPER_ADMIN`

Jika Apps Script tidak dapat memperoleh email pengguna karena konfigurasi deployment, JANGAN menebak email.

Tampilkan instruksi konfigurasi deployment.

==================================================

## 27. GOOGLE APPS SCRIPT WEB APP

==================================================

Audit deployment Web App.

Pastikan konfigurasi sesuai kebutuhan sistem.

Periksa:

* Execute as
* Who has access
* Google Account authentication
* izin Spreadsheet
* izin Drive

Jangan mengubah deployment produksi secara sembrono.

Jika konfigurasi saat ini menyebabkan identitas email pengguna tidak dapat diperoleh, jelaskan masalahnya dan perbaiki konfigurasi dengan pendekatan yang kompatibel.

==================================================

## 28. SECURITY

==================================================

Implementasikan:

* server-side authorization
* role checking
* status checking
* email normalization
* duplicate prevention
* LockService
* audit logging
* soft disable
* no password storage
* no hardcoded users
* no frontend-only authorization
* no sensitive data exposed unnecessarily

Jangan pernah mengirim seluruh database user jika frontend hanya membutuhkan user aktif yang sedang login.

==================================================

## 29. ERROR HANDLING

==================================================

Jika Apps Script gagal:

Frontend harus menampilkan:

`Gagal memeriksa akses. Silakan coba lagi.`

Jangan otomatis memberikan akses.

Jangan fallback ke:

ADMIN

SUPER_ADMIN

atau akun demo.

Jika API gagal:

ACCESS = DENIED / UNKNOWN

bukan ACCESS = GRANTED.

==================================================

## 30. TEST WAJIB

==================================================

Setelah implementasi lakukan test:

TEST 1
Email admin aktif
→ akses diberikan.

TEST 2
Email tidak terdaftar
→ akses ditolak.

TEST 3
Email NONAKTIF
→ akses ditolak.

TEST 4
ADMIN_TU mencoba membuka Manajemen User
→ ditolak.

TEST 5
SUPER_ADMIN membuka Manajemen User
→ diizinkan.

TEST 6
Tambah email yang sudah ada
→ ditolak.

TEST 7
Dua proses tambah user bersamaan
→ USER_ID tidak duplikat.

TEST 8
Nonaktifkan SUPER_ADMIN terakhir
→ ditolak.

TEST 9
Logout
→ akses Dashboard ditutup.

TEST 10
Reload browser
→ sistem kembali memvalidasi akun ke server.

TEST 11
Google Sheets kosong
→ tidak muncul user dummy.

TEST 12
Tidak ada data arsip
→ dashboard tetap menampilkan 0, bukan dummy.

==================================================

## 31. AUDIT SOURCE CODE

==================================================

Scan seluruh frontend dan Apps Script.

Cari:

dummy
mock
fake
sample
demo
testUser
testAdmin
ADMIN_EMAIL
hardcoded user
hardcoded password
localStorage authentication
bypass auth
skip login

Hapus seluruh mekanisme bypass yang tidak diperlukan untuk produksi.

Jangan menghapus test function yang memang diperlukan untuk automated testing, tetapi pastikan tidak dapat memberikan akses produksi.

==================================================

## 32. DATABASE CONSISTENCY

==================================================

Pastikan:

Frontend User Management
↕
Apps Script
↕
02_USERS_ADMIN

adalah satu sumber data.

Setelah tambah/edit/nonaktifkan user:

Google Sheets harus berubah.

Setelah reload Dashboard:

data dibaca kembali dari Google Sheets.

Jangan menyimpan database user kedua di:

* JavaScript array
* localStorage
* sessionStorage
* IndexedDB
* JSON statis

==================================================

## 33. SETUP FUNCTION

==================================================

Buat fungsi utama:

`setupAdminAuthentication()`

Fungsi ini harus:

1. mengecek spreadsheet database
2. membuat `02_USERS_ADMIN` jika belum ada
3. memastikan header benar
4. memastikan tidak ada header duplikat
5. memastikan format tanggal benar
6. memasang kebutuhan trigger jika memang diperlukan
7. melakukan validasi konfigurasi
8. TIDAK membuat dummy user.

Jika sheet sudah ada:

jangan menghapus data.

==================================================

## 34. VALIDATION REPORT

==================================================

Setelah implementasi tampilkan hasil:

====================================
ADMIN AUTHENTICATION AUDIT
==========================

User Sheet: PASS/FAIL
Header Validation: PASS/FAIL
Duplicate Email: 0
Duplicate USER_ID: 0
Dummy User: 0
Hardcoded User: 0
Password Stored: 0
Server Authorization: PASS/FAIL
Role Authorization: PASS/FAIL
Audit Log: PASS/FAIL
Google Account Authentication: PASS/FAIL
Frontend Sync: PASS/FAIL
Sheet Sync: PASS/FAIL

Production Status:
READY / NOT READY

====================================

Jika NOT READY, jelaskan penyebab sebenarnya.

==================================================

## 35. HASIL AKHIR YANG SAYA INGINKAN

==================================================

Saya ingin sistem nyata:

Google Account Admin
↓
Apps Script Authentication
↓
02_USERS_ADMIN
↓
Role & Unit Authorization
↓
Dashboard
↓
01_DATABASE_IJAZAH
↓
Google Drive

Tidak ada dummy.

Tidak ada password palsu.

Tidak ada user hardcoded.

Tidak ada data frontend yang berdiri sendiri.

Tidak ada bypass login.

Google Sheets harus benar-benar menjadi sumber data user admin.

==================================================

## 36. INSTRUKSI PALING PENTING

==================================================

JANGAN hanya membuat file `.md`.

JANGAN hanya memberikan contoh kode.

JANGAN hanya memberikan rekomendasi.

**IMPLEMENTASIKAN PERUBAHAN LANGSUNG PADA SOURCE CODE FRONTEND DAN GOOGLE APPS SCRIPT YANG SUDAH ADA.**

Jika perlu membuat file baru, buat file tersebut dan integrasikan ke sistem.

Jika perlu mengubah fungsi existing, ubah fungsi tersebut secara langsung.

Jika ada konflik dengan kode lama, audit dan perbaiki konflik tersebut.

Jangan membuat sistem kedua.

Jangan membuat mock API.

Jangan menggunakan dummy data.

Setelah selesai, lakukan audit dan berikan laporan hasil implementasi.

TARGET:

**ADMIN LOGIN + USER MANAGEMENT + GOOGLE SHEETS SYNC = PRODUCTION READY**
