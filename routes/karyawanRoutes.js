const express = require("express");
const router = express.Router();
const {
  registerKaryawan,
  getKaryawanList,
  updateKaryawan,
} = require("../controllers/karyawanController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, registerKaryawan);
router.get("/list", verifyToken, getKaryawanList);
router.put("/update/:nip", verifyToken, updateKaryawan);

module.exports = router;
