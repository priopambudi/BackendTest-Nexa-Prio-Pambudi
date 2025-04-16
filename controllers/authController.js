const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { decrypt } = require("../utils/encrypt");

exports.getToken = async (req, res) => {
  if (!req.body)
    return res.status(400).json({ message: "Username & Password harus diisi" });

  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username & Password harus diisi" });

  try {
    const [rows] = await db.query("SELECT * FROM admin WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0)
      return res.status(401).json({ message: "User tidak ditemukan" });

    const user = rows[0];

    const passwordMatch = await decrypt(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ message: "Password salah" });

    const timestamp = Date.now();
    const token = jwt.sign({ username, timestamp }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const expiredAt = new Date(Date.now() + 60 * 60 * 1000);

    // Simpan token ke admin_token
    await db.query(
      "INSERT INTO admin_token (id_admin, token, expired_at) VALUES (?, ?, ?)",
      [user.id, token, expiredAt]
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
