// backend/routes/comentarios.js
import express from "express";
import Comentario from "../models/Comentario.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

// Obtener comentarios de un evento
router.get("/evento/:eventoId", async (req, res) => {
  try {
    const { pagina = 1, limite = 10 } = req.query;

    const comentarios = await Comentario.find({
      evento: req.params.eventoId,
      activo: true,
    })
      .populate("usuario", "nombre email")
      .sort({ fechaCreacion: -1 })
      .limit(limite * 1)
      .skip((pagina - 1) * limite);

    const total = await Comentario.countDocuments({
      evento: req.params.eventoId,
      activo: true,
    });

    res.json({
      comentarios,
      totalPaginas: Math.ceil(total / limite),
      paginaActual: pagina,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener comentarios", error: error.message });
  }
});

// Crear comentario (usuario autenticado)
router.post("/", verificarToken, async (req, res) => {
  try {
    const { evento, contenido, calificacion } = req.body;

    // Verificar que el usuario no haya comentado ya este evento
    const comentarioExistente = await Comentario.findOne({
      usuario: req.usuario.id,
      evento,
      activo: true,
    });

    if (comentarioExistente) {
      return res.status(400).json({ mensaje: "Ya has comentado este evento" });
    }

    const nuevoComentario = new Comentario({
      usuario: req.usuario.id,
      evento,
      contenido,
      calificacion,
    });

    await nuevoComentario.save();
    await nuevoComentario.populate("usuario", "nombre email");

    res.status(201).json({
      mensaje: "Comentario creado exitosamente",
      comentario: nuevoComentario,
    });
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al crear comentario", error: error.message });
  }
});

// Dar like a un comentario
router.post("/:id/like", verificarToken, async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);

    if (!comentario) {
      return res.status(404).json({ mensaje: "Comentario no encontrado" });
    }

    const yaLeDioLike = comentario.likes.includes(req.usuario.id);

    if (yaLeDioLike) {
      comentario.likes = comentario.likes.filter(
        (id) => id.toString() !== req.usuario.id
      );
    } else {
      comentario.likes.push(req.usuario.id);
    }

    await comentario.save();

    res.json({
      mensaje: yaLeDioLike ? "Like eliminado" : "Like agregado",
      likes: comentario.likes.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al procesar like", error: error.message });
  }
});

// Eliminar comentario (solo el autor)
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);

    if (!comentario) {
      return res.status(404).json({ mensaje: "Comentario no encontrado" });
    }

    if (
      comentario.usuario.toString() !== req.usuario.id &&
      req.usuario.rol !== "admin"
    ) {
      return res.status(403).json({ mensaje: "No autorizado" });
    }

    comentario.activo = false;
    await comentario.save();

    res.json({ mensaje: "Comentario eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar comentario", error: error.message });
  }
});

export default router;
