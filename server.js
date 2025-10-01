// server.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 1100;

async function start() {
  try {
    // Conexión a Mongo (si truena, verás el error)
    await connectDB();
  } catch (err) {
    console.error("Error conectando a Mongo:", err?.message || err);
    // Si prefieres abortar: process.exit(1);
  }

  // Healthcheck útil para curl rápido
  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} exitosamente`);
  });
}

start();
