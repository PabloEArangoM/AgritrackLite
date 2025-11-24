import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import lotesRoutes from "./routes/lotesRoutes.js";
import tareasRoutes from "./routes/tareasRoutes.js";
import laboresRoutes from "./routes/laboresRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/authMiddleware.js";

// 🔹 Cargar variables de entorno (.env)
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/health", (req, res) => {
  res.json({ ok: true, mensaje: "API AgriTrack Lite funcionando" });
});

// 🔓 Rutas públicas
app.use("/api/auth", authRoutes);

// 🔒 Rutas protegidas (requieren token)
app.use("/api/lotes", requireAuth, lotesRoutes);
app.use("/api/tareas", requireAuth, tareasRoutes);
app.use("/api/labores", requireAuth, laboresRoutes);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
});
