const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Usuario = require("./models/Usuario");
require("dotenv").config();

async function crearAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    // Verificar si ya existe un admin
    const adminExistente = await Usuario.findOne({
      email: "admin@eventosapp.com",
    });

    if (adminExistente) {
      console.log("⚠️  Ya existe un administrador con ese email");
      process.exit(0);
    }

    // Crear contraseña encriptada
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash("admin123", salt);

    // Crear usuario admin
    const admin = new Usuario({
      nombre: "Administrador",
      email: "admin@eventosapp.com",
      password: passwordEncriptado,
      tipo: "admin",
    });

    await admin.save();

    console.log("✅ Administrador creado exitosamente");
    console.log("📧 Email: admin@eventosapp.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️  CAMBIA ESTA CONTRASEÑA DESPUÉS DEL PRIMER LOGIN");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

crearAdmin();
