# Aksara - Manajemen Tugas (Tugas BAB 7 Ajax dan Konsumsi API)

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

## Fitur BAB 7: Ajax dan Konsumsi API Eksternal

### Endpoint API yang Dipakai

Menggunakan **DummyJSON Quotes API** (`https://dummyjson.com/quotes`):
- `GET /quotes?limit=5` — mengambil 5 kutipan motivasi
- `POST /quotes/add` — mengirim kutipan baru (mock, data tidak tersimpan permanen)

API ini dipilih karena cocok dengan tema LMS — kutipan motivasi belajar untuk mahasiswa. DummyJSON gratis, tanpa registrasi, dan mendukung CORS.

### Komponen Baru: `KutipanMotivasi.jsx`

Komponen ini menangani seluruh siklus AJAX:

- **State `loading`** (boolean): saat `true`, menampilkan teks "Memuat kutipan..." sebagai indikator loading
- **State `error`** (string/null): saat terisi, menampilkan pesan error beserta tombol **"Coba Lagi"** untuk mengulang `fetch()`
- **State `kutipan`** (array): saat data berhasil diambil, di-render sebagai list menggunakan `.map()` dengan `item.id` sebagai key unik
- **Fungsi `ambilKutipan()`**: menjalankan `fetch()` ke endpoint GET, mengatur ketiga state di atas sesuai hasil
- **Fungsi `handleSubmitKutipan()`**: mengirim data kutipan baru via `fetch()` dengan method POST ke `/quotes/add`, hasilnya ditambahkan ke daftar yang ditampilkan

### Pola Loading/Error

1. Saat komponen pertama kali di-mount, `useEffect` memanggil `ambilKutipan()` yang mengeset `loading = true`
2. Jika `fetch()` berhasil → `loading = false`, data masuk ke state `kutipan`, UI menampilkan daftar kutipan
3. Jika `fetch()` gagal (network error / status bukan 2xx) → `loading = false`, `error` diisi pesan, UI menampilkan pesan error + tombol "Coba Lagi"
4. Tombol "Coba Lagi" memanggil `ambilKutipan()` lagi dari awal

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
