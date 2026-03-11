// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const router = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "mi_clave_secreta_super_segura_12345";

// REGISTRO de nuevo usuario (solo usuarios normales)
router.post("/registro", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash(password, salt);

    // Crear nuevo usuario (siempre como usuario normal)
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordEncriptado,
      tipo: "usuario",
    });

    await nuevoUsuario.save();

    // Crear token JWT
    const token = jwt.sign(
      {
        id: nuevoUsuario._id,
        email: nuevoUsuario.email,
        tipo: nuevoUsuario.tipo,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        tipo: nuevoUsuario.tipo,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res
      .status(500)
      .json({ mensaje: "Error al registrar usuario", error: error.message });
  }
});

// LOGIN de usuario o admin
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res
        .status(400)
        .json({ mensaje: "Email o contraseña incorrectos" });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res
        .status(400)
        .json({ mensaje: "Email o contraseña incorrectos" });
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        tipo: usuario.tipo,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res
      .status(500)
      .json({ mensaje: "Error al iniciar sesión", error: error.message });
  }
});

// Verificar token
router.get("/verificar", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ mensaje: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id).select("-password");

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ usuario });
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido" });
  }
});

export default router;
