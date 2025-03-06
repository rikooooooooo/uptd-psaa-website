Panduan ini akan membantu Anda menginstal dan menjalankan proyek ini di lingkungan lokal.
Proyek ini menggunakan React untuk frontend, PostgreSQL untuk database, dan Cloudinary untuk penyimpanan media.

1. Persyaratan
Pastikan Anda telah menginstal:

Node.js (minimal versi 16)
PostgreSQL (minimal versi 13)
Git
Cloudinary Account (untuk penyimpanan media)

2. Clone Repository
Pertama, buka terminal dan jalankan perintah berikut untuk menduplikasi proyek ke komputer Anda:


git clone https://github.com/username/project-name.git
Ganti username dan project-name sesuai dengan repository GitHub Anda.
Lalu masuk ke folder proyek:


cd project-name
3. Instalasi Dependency
Jalankan perintah berikut untuk menginstal semua package yang diperlukan:


npm install

4. Konfigurasi Database (PostgreSQL)
a. Buat Database
Buka PostgreSQL dan buat database baru

createdb nama_database
Atau gunakan pgAdmin untuk membuat database secara visual.

b. Konfigurasi .env
Buat file .env di root folder proyek, lalu isi dengan konfigurasi database Anda:


DATABASE_URL=postgres://username:password@localhost:5432/nama_database
Ganti username, password, dan nama_database sesuai dengan PostgreSQL Anda.

c. Migrasi Database


5. Konfigurasi Cloudinary
Buat akun di Cloudinary, lalu dapatkan Cloud Name, API Key, dan API Secret.

Tambahkan informasi ini ke file .env:


CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

6. Jalankan Server API 
proyek ini memiliki backend, jalankan server backend terlebih dahulu:

node src\Server.js

7. Menjalankan Proyek
Sekarang jalankan proyek dengan perintah:


npm run start





Jika semuanya berjalan dengan baik, buka browser dan akses:
👉 http://localhost:3000/
