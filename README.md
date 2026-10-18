# Aksara - LMS (Tugas BAB 5 Javascript dan Jquery)

Aplikasi web Learning Management System (LMS) Aksara dengan interaktivitas client-side menggunakan JavaScript dan jQuery.

## Fitur Interaktif (JavaScript & jQuery)

1. JavaScript Murni:
- Menyimpan data dummy daftar tugas menggunakan array of object.
- Fungsi menghitung jumlah tugas yang belum selesai.
- Fungsi filter data tugas berdasarkan status.
- Perulangan dan percabangan untuk me-render daftar tugas ke tabel secara dinamis beserta pewarnaan status.

2. jQuery:
- Efek animasi slideToggle dan slideUp untuk menampilkan dan menyembunyikan form tambah tugas.
- Efek animasi slideDown dan slideUp untuk notifikasi pesan berhasil.
- Efek animasi slideToggle untuk menampilkan/menyembunyikan materi pada halaman detail kursus.
- Event handling on('submit') pada form tambah tugas disertai validasi field kosong.
- Event handling on('click') untuk menghapus data tugas dari tabel.
- Event handling on('change') pada dropdown filter untuk menyaring data tugas.
- Event handling on('submit') pada form login dan form pengumpulan tugas dengan validasi input.

## Dokumentasi Screenshot Interaksi

Screenshot sebelum dan sesudah interaksi tersimpan di folder docs/screenshots/:
- 1-sebelum-interaksi.png: Tampilan awal tabel tugas hasil render dinamis JavaScript.
- 2-form-tambah-terbuka.png: Tampilan saat form tambah tugas dibuka (efek slideToggle).
- 3-setelah-tambah-tugas.png: Tampilan setelah data tugas baru berhasil ditambahkan dan notifikasi muncul.
- 4-filter-status.png: Tampilan setelah data difilter berdasarkan status.
- 5-setelah-hapus-tugas.png: Tampilan setelah salah satu tugas dihapus dari tabel.
- 6-toggle-materi.png: Tampilan efek toggle materi pada halaman detail kursus.

