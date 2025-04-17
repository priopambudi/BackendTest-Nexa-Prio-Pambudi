const express = require("express");
const router = express.Router();
const { registerKaryawan } = require("../controllers/karyawanController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, registerKaryawan);

module.exports = router;
