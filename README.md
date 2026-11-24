# John Clothes – Landing Page

Landing page toko baju wanita online. Pesan langsung via WhatsApp.

## Setup

1. Edit `app.js` baris pertama — ganti `WHATSAPP_NUMBER` dengan nomor WA penjual (format: `628xxxxx`).
2. Edit array `products` di `app.js` untuk mengubah daftar produk, harga, ukuran, dan warna.

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub (misal: `john-clothes`).
2. Upload semua file ini ke repository tersebut.
3. Buka **Settings → Pages**.
4. Di bagian **Source**, pilih branch `main` dan folder `/ (root)`.
5. Klik **Save** — website akan aktif di `https://<username>.github.io/john-clothes/`.

## File

| File | Fungsi |
|------|--------|
| `index.html` | Struktur halaman |
| `style.css` | Tampilan & layout |
| `app.js` | Logika katalog, keranjang, & WhatsApp |
| `.nojekyll` | Menonaktifkan proses Jekyll GitHub Pages |
