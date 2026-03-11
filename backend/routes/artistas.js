// backend/routes/artistas.js
import express from "express";
import Artista from "../models/Artista.js";
import { verificarToken, verificarAdmin } from "../middleware/auth.js";

const router = express.Router();

// Obtener todos los artistas (público)
router.get("/", async (req, res) => {
  try {
    const { genero, buscar, activo = true } = req.query;
    let filtro = { activo };

    if (genero) {
      filtro.generoMusical = genero;
    }

    if (buscar) {
      filtro.$or = [
        { nombre: { $regex: buscar, $options: "i" } },
        { nombreArtistico: { $regex: buscar, $options: "i" } },
      ];
    }

    const artistas = await Artista.find(filtro)
      .populate("eventos", "nombre fecha ubicacion")
      .sort({ fechaCreacion: -1 });

    res.json(artistas);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener artistas", error: error.message });
  }
});

// Obtener un artista por ID
router.get("/:id", async (req, res) => {
  try {
    const artista = await Artista.findById(req.params.id).populate(
      "eventos",
      "nombre fecha ubicacion precio"
    );

    if (!artista) {
      return res.status(404).json({ mensaje: "Artista no encontrado" });
    }

    res.json(artista);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener artista", error: error.message });
  }
});

// Crear artista (solo admin)
router.post("/", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const nuevoArtista = new Artista(req.body);
    await nuevoArtista.save();

    res.status(201).json({
      mensaje: "Artista creado exitosamente",
      artista: nuevoArtista,
    });
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al crear artista", error: error.message });
  }
});

// Actualizar artista (solo admin)
router.put("/:id", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const artistaActualizado = await Artista.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!artistaActualizado) {
      return res.status(404).json({ mensaje: "Artista no encontrado" });
    }

    res.json({
      mensaje: "Artista actualizado exitosamente",
      artista: artistaActualizado,
    });
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al actualizar artista", error: error.message });
  }
});

// Eliminar artista (solo admin - soft delete)
router.delete("/:id", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const artista = await Artista.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );

    if (!artista) {
      return res.status(404).json({ mensaje: "Artista no encontrado" });
    }

    res.json({ mensaje: "Artista eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar artista", error: error.message });
  }
});

export default router;
