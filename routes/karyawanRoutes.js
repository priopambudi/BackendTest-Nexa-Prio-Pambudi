const express = require("express");
const router = express.Router();
const {
  registerKaryawan,
  getKaryawanList,
  updateKaryawan,
  disableKaryawan,
} = require("../controllers/karyawanController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, registerKaryawan);
router.get("/list", verifyToken, getKaryawanList);
router.put("/update/:nip", verifyToken, updateKaryawan);
router.put("/disable/:nip", verifyToken, disableKaryawan);

module.exports = router;
