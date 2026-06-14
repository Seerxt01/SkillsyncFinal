// Load environment variables FIRST — before anything else
// If this runs after other requires, process.env values will be undefined
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
// cors()         → allows React (port 5173) to call this server (port 5000)
// express.json() → parses JSON from request body into req.body
// ─────────────────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
// We import our auth router and mount it at "/api/auth"
// Any request to /api/auth/... will be handled by routes/auth.js
// ─────────────────────────────────────────────────────────────────────────────
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const skillRoutes = require("./routes/skills");
app.use("/api/skills", skillRoutes);

const exchangeRoutes = require("./routes/exchanges");
app.use("/api/exchanges", exchangeRoutes);

// Health check route — useful to test if server is running
app.get("/", (req, res) => {
  res.json({ message: "SkillSync API is running!" });
});

// ─── Start server AFTER DB connects ──────────────────────────────────────────
// We use .then() so app.listen() only runs if MongoDB connects successfully
// If DB fails, we crash loudly with process.exit(1) — better than silent failure
// ─────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err.message);
  process.exit(1);
});
