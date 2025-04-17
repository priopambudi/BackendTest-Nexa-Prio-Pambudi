const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const karyawanRoutes = require("./routes/karyawanRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/karyawan", karyawanRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
