// backend/routes/admin.js
import express from "express";
import Usuario from "../models/Usuario.js";
import Evento from "../models/Evento.js";
import Compra from "../models/Compra.js";
import Artista from "../models/Artista.js";
import Comentario from "../models/Comentario.js";
import { verificarToken, verificarAdmin } from "../middleware/auth.js";

const router = express.Router();

// Dashboard - Estadísticas generales
router.get("/dashboard", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const [
      totalUsuarios,
      totalEventos,
      totalArtistas,
      totalCompras,
      totalComentarios,
      ventasRecientes,
      eventosProximos,
    ] = await Promise.all([
      Usuario.countDocuments({ tipo: "usuario" }), // Cambiar 'rol' por 'tipo'
      Evento.countDocuments(),
      Artista.countDocuments({ activo: true }),
      Compra.countDocuments(),
      Comentario.countDocuments({ activo: true }),
      Compra.find()
        .populate("usuario", "nombre email")
        .populate("evento", "nombre fecha")
        .sort({ fechaCompra: -1 })
        .limit(10),
      Evento.find({
        fecha: { $gte: new Date() },
      })
        .sort({ fecha: 1 })
        .limit(5),
    ]);

    // Calcular ingresos totales
    const ingresosTotales = await Compra.aggregate([
      { $group: { _id: null, total: { $sum: "$precioTotal" } } }, // Cambiar '$total' por '$precioTotal'
    ]);

    res.json({
      estadisticas: {
        totalUsuarios,
        totalEventos,
        totalArtistas,
        totalCompras,
        totalComentarios,
        ingresosTotales: ingresosTotales[0]?.total || 0,
      },
      ventasRecientes,
      eventosProximos,
    });
  } catch (error) {
    console.error("Error en dashboard:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener estadísticas", error: error.message });
  }
});

// Obtener todos los usuarios
router.get("/usuarios", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { pagina = 1, limite = 10, buscar } = req.query;
    let filtro = {};

    if (buscar) {
      filtro = {
        $or: [
          { nombre: { $regex: buscar, $options: "i" } },
          { email: { $regex: buscar, $options: "i" } },
        ],
      };
    }

    const usuarios = await Usuario.find(filtro)
      .select("-password")
      .sort({ fechaRegistro: -1 })
      .limit(limite * 1)
      .skip((pagina - 1) * limite);

    const total = await Usuario.countDocuments(filtro);

    res.json({
      usuarios,
      totalPaginas: Math.ceil(total / limite),
      paginaActual: Number(pagina),
      total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener usuarios", error: error.message });
  }
});

// Actualizar tipo de usuario (rol)
router.put(
  "/usuarios/:id/tipo",
  verificarToken,
  verificarAdmin,
  async (req, res) => {
    try {
      const { tipo } = req.body;

      if (!["usuario", "admin"].includes(tipo)) {
        return res.status(400).json({ mensaje: "Tipo inválido" });
      }

      const usuario = await Usuario.findByIdAndUpdate(
        req.params.id,
        { tipo },
        { new: true }
      ).select("-password");

      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      res.json({
        mensaje: "Tipo actualizado exitosamente",
        usuario,
      });
    } catch (error) {
      res
        .status(500)
        .json({ mensaje: "Error al actualizar tipo", error: error.message });
    }
  }
);

// Obtener todas las compras
router.get("/compras", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { pagina = 1, limite = 20 } = req.query;

    const compras = await Compra.find()
      .populate("usuario", "nombre email")
      .populate("evento", "nombre fecha lugar")
      .sort({ fechaCompra: -1 })
      .limit(limite * 1)
      .skip((pagina - 1) * limite);

    const total = await Compra.countDocuments();

    res.json({
      compras,
      totalPaginas: Math.ceil(total / limite),
      paginaActual: Number(pagina),
      total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener compras", error: error.message });
  }
});

export default router;
