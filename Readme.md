# BackendTest Nexa - Prio Pambudi

## 🧾 Deskripsi

Project ini adalah hasil dari pengerjaan tes backend Nexa yang menggunakan Node.js dan MySQL. Fitur utama dari project ini meliputi:

- Menyimpan data karyawan ke database menggunakan stored procedure.
- Menyimpan log transaksi API ke tabel `log_trx_api`.
- Menampilkan data karyawan dalam bentuk view dengan format tertentu.
- Project dijalankan menggunakan Docker untuk memastikan kemudahan deploy dan testing.

---

## ⚙️ Teknologi yang Digunakan

- Node.js (Express)
- MySQL
- Docker
- Docker Compose (opsional)

---

## 🚀 Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/priopambudi/BackendTest-Nexa-Prio-Pambudi.git
cd BackendTest-Nexa-Prio-Pambudi
```

### 2. Jalankan dengan Docker

a. Build dan Run

```
docker build -t backend-nexa-prio .
docker run -p 8080:8080 backend-nexa-prio
```

b. Atau gunakan Docker Compose

```
docker-compose up --build
```

### 3. Jalankan tanpa Docker (Opsional untuk lokal)

```
npm install
npm run dev
```

## 📌 Stored Procedure

Nama: `sp_add_kary_prio`

Fungsi: Menyimpan data karyawan ke tabel `karyawan`, sekaligus menyimpan log ke `log_trx_api`. Jika terjadi error atau duplikat nip, maka akan di-rollback.

## 👁️ View Data Karyawan

Nama: `karyawan_prio`

Berfungsi untuk menampilkan data karyawan dengan format:

- No: Auto increment
- Nip
- Nama
- Alamat
- Gend: (Laki-laki / Perempuan)
- Tanggal Lahir: Format 12 April 2023

## 🔗 Endpoint API

- `POST /api/auth/get-token`. Digunakan untuk melakukan validasi login dengan password AES dengan key khusus serta mendapatkan jwt token dengan sign username dan timestamp.
- `POST /api/karyawan`. Digunakan untuk menambahkan data karyawan melalui stored procedure.
- `GET /api/karyawan/list`. Digunakan untuk menampilkan list, baik menggunakan keyword ataupun tidak, serta menggunakan parameter start dan count untuk pagination.
- `PUT /api/karyawan/update/:nip`. Digunakan untuk melakukan update terhadap data karyawan dengan parameter berdasarkan nip.
- `PUT /api/karyawan/disable/:nip`. Digunakan untuk menonaktifkan karyawan dengan nip sebagai paramete.

## 📦 Deployment

Dockerfile (Alpine)

Project ini dibangun dengan base image node:alpine. Script start sudah didefinisikan di package.json.

## 🧪 Testing

- Gunakan Postman untuk menguji endpoint.
- Gunakan DBeaver atau MySQL CLI untuk memastikan data tersimpan.

## 📄 Catatan Tambahan

- Sebelum menjalankan project, pastikan prosedur sudah dibuat di database:

```
-- Stored Procedure
SHOW PROCEDURE STATUS WHERE Db = '';
```

---

## 👤 Author

Prio Pambudi

Backend Developer – 2025

GitHub: https://github.com/priopambudi
