const db = require("../config/db");

exports.registerKaryawan = async (req, res) => {
  try {
    const {
      nama,
      alamat,
      gend,
      tgl_lahir,
      photo, // base64
    } = req.body;

    // Validasi field kosong
    if (!nama || !alamat || !gend || !tgl_lahir || !photo) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }
    const username = req.user?.username;
    if (!username)
      return res.status(403).json({ message: "Token tidak valid" });

    // Cari ID admin dari database
    const [admins] = await db.query("SELECT id FROM admin WHERE username = ?", [
      username,
    ]);
    if (admins.length === 0) {
      return res.status(401).json({ message: "Admin tidak ditemukan" });
    }
    const id_admin = admins[0].id;

    // Generate NIP unik
    const nip = await generateNip();

    // Cek NIP sudah ada (shouldn't happen, but good practice)
    const [cekNip] = await db.query("SELECT * FROM karyawan WHERE nip = ?", [
      nip,
    ]);
    if (cekNip.length > 0) {
      return res
        .status(409)
        .json({ message: "NIP sudah ada, silakan coba lagi" });
    }

    // Simpan data
    await db.query(
      `INSERT INTO karyawan (nip, nama, alamat, gend, tgl_lahir, photo, insert_at, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nip, nama, alamat, gend, tgl_lahir, photo, new Date(), id_admin]
    );

    res.status(201).json({ message: "Karyawan berhasil ditambahkan", nip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat menyimpan data" });
  }
};

const generateNip = async () => {
  const year = new Date().getFullYear();
  const [rows] = await db.query(
    "SELECT COUNT(*) as total FROM karyawan WHERE nip LIKE ?",
    [`${year}%`]
  );
  const counter = (rows[0].total + 1).toString().padStart(4, "0");
  return `${year}${counter}`;
};

// Fungsi untuk escape karakter khusus agar aman dari SQL injection
const escapeLike = (str) => {
  return str.replace(/[%_]/g, "\\$&");
};

exports.getKaryawanList = async (req, res) => {
  try {
    const { keyword = "", start, count } = req.query;

    // Validasi field wajib
    if (start === undefined || count === undefined) {
      return res.status(400).json({
        status: false,
        message: "Start dan Count wajib diisi.",
      });
    }

    // Validasi input
    if (isNaN(start) || isNaN(count)) {
      return res
        .status(400)
        .json({ message: "Start dan Count harus berupa angka" });
    }

    // Ambil username dari token yang sudah di-parse oleh middleware
    const username = req.user?.username;
    if (!username) {
      return res.status(403).json({ message: "Token tidak valid" });
    }

    // Cek apakah admin ada
    const [admins] = await db.query("SELECT id FROM admin WHERE username = ?", [
      username,
    ]);
    if (admins.length === 0) {
      return res.status(401).json({ message: "Admin tidak ditemukan" });
    }

    // Escape karakter % dan _ agar aman untuk LIKE
    const escapedKeyword = escapeLike(keyword.trim());
    const searchKeyword = `%${escapedKeyword}%`;
    const [results] = await db.query(
      `SELECT * FROM karyawan WHERE nama LIKE ? ORDER BY insert_at DESC LIMIT ?, ?`,
      [searchKeyword, parseInt(start), parseInt(count)]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.status(200).json({
      total: results.length,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data" });
  }
};
