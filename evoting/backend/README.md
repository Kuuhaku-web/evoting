# Backend — Run & Expose

Panduan singkat untuk membuat backend Anda dapat diakses oleh teman/klien lain tanpa mengubah smart contract.

## 1) Jalankan lokal

1. Buka terminal di folder `evoting/backend`.
2. Install dependency (jika belum):

```bash
cd evoting/backend
npm install
```

3. Jalankan server:

```bash
npm start
```

Server akan berjalan pada port sesuai `backend/.env` (`PORT=5000`).

## 2) Opsi cepat — ngrok (rekomendasi untuk testing cepat)

1. Download dan install ngrok dari https://ngrok.com/
2. Jalankan ngrok untuk port 5000:

```bash
ngrok http 5000
```

3. Salin `Forwarding` URL (misal `https://abcd-1234.ngrok.io`).
4. Beritahu teman untuk memakai URL tersebut sebagai base API, atau ubah di frontend `.env`:

```
REACT_APP_API_URL=https://abcd-1234.ngrok.io
```

5. Restart frontend (`npm start`) agar env baru terbaca.

Catatan: ngrok free URL berubah tiap kali dijalankan; untuk URL tetap butuh akun berbayar.

## 3) Opsi LAN (teman berada di jaringan yang sama)

1. Temukan IP lokal mesin (Windows: `ipconfig` → IPv4 Address, mis. `192.168.1.10`).
2. Pastikan Firewall membuka port 5000 untuk inbound.
3. Di `evoting/.env` set:

```
REACT_APP_API_URL=http://192.168.1.10:5000
```

4. Teman mengakses frontend di browser mereka (jika frontend di-host secara terpusat) atau Anda harus host frontend juga.

## 4) Opsi permanen — Deploy backend (recommended untuk akses publik)

- Platform yang mudah: Railway, Render, Fly, Heroku.
- Persiapan:
  - Pastikan `backend/package.json` punya `start` script (sudah disediakan).
  - Pastikan `backend/.env` environment variables (MONGODB_URI, JWT_SECRET) dijaga di dashboard platform, jangan commit ke repo.
  - Deploy, lalu set `REACT_APP_API_URL` di frontend ke URL publik yang diberikan.

Contoh cepat (Railway):
1. Buat project baru di Railway dan connect repo atau deploy manual.
2. Tambahkan environment variables di Railway (MONGODB_URI, JWT_SECRET).
3. Setelah deployed, dapatkan URL public dan gunakan di frontend.

## 5) CORS dan keamanan

- Server sudah memakai `app.use(cors())`, jadi seharusnya permintaan eksternal diterima.
- Pastikan MongoDB Atlas mengizinkan akses dari IP server / gunakan `0.0.0.0/0` untuk testing (tidak disarankan untuk production).

---

Jika mau, saya bisa bantu:
- Menuntun Anda jalankan `ngrok` langkah-demi-langkah sekarang.
- Membantu deploy ke Railway/Render (siapkan instruksi lengkap dan file jika perlu).

Pilih yang Anda mau dan saya lanjutkan.