const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10mb" }));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
