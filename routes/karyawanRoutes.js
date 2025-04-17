const express = require("express");
const router = express.Router();
const {
  registerKaryawan,
  getKaryawanList,
} = require("../controllers/karyawanController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, registerKaryawan);
router.get("/list", verifyToken, getKaryawanList);

module.exports = router;
