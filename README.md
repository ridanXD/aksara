# Aksara - Manajemen Tugas (Tugas BAB 6 React Dasar)

Aplikasi frontend manajemen tugas kuliah berbasis React dan Vite. Project ini merupakan kerangka awal aplikasi fullstack yang akan dikembangkan hingga Pekan 14.

## Entitas Data Utama
- **Entitas:** Tugas
- **Atribut:**
  - `id`: Identifier unik tugas
  - `judul`: Judul / nama tugas
  - `mataKuliah`: Nama mata kuliah
  - `deadline`: Batas waktu pengumpulan
  - `status`: Status pengerjaan (Belum Selesai, Sedang Dikerjakan, Selesai)

## Struktur Komponen (src/components/)
1. `Header.jsx`: Komponen header dan judul aplikasi.
2. `RingkasanTugas.jsx`: Komponen ringkasan total tugas, tugas belum selesai, dan tugas selesai.
3. `FormTugas.jsx`: Komponen controlled form untuk menambahkan data tugas baru.
4. `DaftarTugas.jsx`: Komponen untuk menampilkan daftar tugas dan menangani conditional rendering ketika data kosong.
5. `KartuTugas.jsx`: Komponen kartu untuk menampilkan detail setiap item tugas beserta tombol hapus.
6. `Footer.jsx`: Komponen footer aplikasi.

## Fitur Interaktivitas
- State array di `App.jsx` untuk menyimpan daftar tugas.
- Render list menggunakan `.map()` dengan key unik pada setiap item.
- Controlled component pada form input dengan tombol Tambah.
- Conditional rendering menampilkan teks "Belum ada data tugas" saat daftar kosong.
- Tombol hapus pada tiap kartu tugas untuk menghapus data.

## Cara Menjalankan
1. Install dependensi:
   ```bash
   npm install
   ```
2. Jalankan server development:
   ```bash
   npm run dev
   ```
3. Buka browser pada alamat `http://localhost:5173`.
