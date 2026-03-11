// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Importar rutas
import eventosRoutes from "./routes/eventos.js";
import authRoutes from "./routes/auth.js";
import comprasRoutes from "./routes/compras.js";
import artistasRoutes from "./routes/artistas.js";
import comentariosRoutes from "./routes/comentarios.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err.message));

// Usar rutas
app.use("/api/eventos", eventosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/artistas", artistasRoutes);
app.use("/api/comentarios", comentariosRoutes);
app.use("/api/admin", adminRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ mensaje: "¡API de EventosApp funcionando!" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📍 Endpoints disponibles:`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/registro`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   - GET  http://localhost:${PORT}/api/eventos`);
  console.log(`   - POST http://localhost:${PORT}/api/compras`);
  console.log(`   - GET  http://localhost:${PORT}/api/compras/mis-compras`);
  console.log(`   - GET  http://localhost:${PORT}/api/artistas`);
  console.log(`   - POST http://localhost:${PORT}/api/artistas (admin)`);
  console.log(`   - GET  http://localhost:${PORT}/api/admin/dashboard (admin)`);
  console.log(`   - GET  http://localhost:${PORT}/api/comentarios/evento/:id`);
  console.log(`   - POST http://localhost:${PORT}/api/comentarios`);
});
