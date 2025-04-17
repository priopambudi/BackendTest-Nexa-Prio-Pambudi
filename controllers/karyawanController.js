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
