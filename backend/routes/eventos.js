// backend/routes/eventos.js
import express from "express";
import Evento from "../models/Evento.js";
import { verificarToken, verificarAdmin } from "../middleware/auth.js";

const router = express.Router();

// Obtener todos los eventos (público)
router.get("/", async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ fecha: 1 });
    res.json(eventos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener eventos", error: error.message });
  }
});

// Obtener un evento por ID (público)
router.get("/:id", async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }
    res.json(evento);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener evento", error: error.message });
  }
});

// Crear un nuevo evento (SOLO ADMIN)
router.post("/", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const {
      nombre,
      fecha,
      lugar,
      precioGeneral,
      precioVIP,
      capacidadGeneral,
      capacidadVIP,
      descripcion,
      imagen,
      imagenMapa,
    } = req.body;

    const nuevoEvento = new Evento({
      nombre,
      fecha,
      lugar,
      precioGeneral,
      precioVIP,
      capacidadGeneral,
      capacidadVIP,
      disponiblesGeneral: capacidadGeneral,
      disponiblesVIP: capacidadVIP,
      descripcion,
      imagen:
        imagen ||
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500",
      imagenMapa: imagenMapa || "",
      creadoPor: req.usuario.id,
    });

    const eventoGuardado = await nuevoEvento.save();
    res.status(201).json(eventoGuardado);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al crear evento", error: error.message });
  }
});

// Actualizar un evento (SOLO ADMIN)
router.put("/:id", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    const {
      nombre,
      fecha,
      lugar,
      precioGeneral,
      precioVIP,
      capacidadGeneral,
      capacidadVIP,
      descripcion,
      imagen,
      imagenMapa,
    } = req.body;

    // Actualizar campos básicos
    evento.nombre = nombre || evento.nombre;
    evento.fecha = fecha || evento.fecha;
    evento.lugar = lugar || evento.lugar;
    evento.precioGeneral = precioGeneral || evento.precioGeneral;
    evento.precioVIP = precioVIP || evento.precioVIP;
    evento.descripcion = descripcion || evento.descripcion;
    evento.imagen = imagen || evento.imagen;
    evento.imagenMapa = imagenMapa || evento.imagenMapa;

    // Actualizar capacidades si se proporcionan
    if (capacidadGeneral) {
      const vendidasGeneral =
        evento.capacidadGeneral - evento.disponiblesGeneral;
      if (capacidadGeneral >= vendidasGeneral) {
        evento.capacidadGeneral = capacidadGeneral;
        evento.disponiblesGeneral = capacidadGeneral - vendidasGeneral;
      } else {
        return res.status(400).json({
          mensaje: `Capacidad General: No puedes reducir por debajo de ${vendidasGeneral} (entradas ya vendidas)`,
        });
      }
    }

    if (capacidadVIP) {
      const vendidasVIP = evento.capacidadVIP - evento.disponiblesVIP;
      if (capacidadVIP >= vendidasVIP) {
        evento.capacidadVIP = capacidadVIP;
        evento.disponiblesVIP = capacidadVIP - vendidasVIP;
      } else {
        return res.status(400).json({
          mensaje: `Capacidad VIP: No puedes reducir por debajo de ${vendidasVIP} (entradas ya vendidas)`,
        });
      }
    }

    const eventoActualizado = await evento.save();
    res.json(eventoActualizado);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al actualizar evento", error: error.message });
  }
});

// Eliminar un evento (SOLO ADMIN)
router.delete("/:id", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    // Verificar si hay entradas vendidas en cualquier zona
    const vendidasGeneral = evento.capacidadGeneral - evento.disponiblesGeneral;
    const vendidasVIP = evento.capacidadVIP - evento.disponiblesVIP;
    const totalVendidas = vendidasGeneral + vendidasVIP;

    if (totalVendidas > 0) {
      return res.status(400).json({
        mensaje: `No puedes eliminar este evento porque ya se vendieron ${totalVendidas} entradas (${vendidasGeneral} General, ${vendidasVIP} VIP)`,
      });
    }

    await Evento.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Evento eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar evento", error: error.message });
  }
});

// Obtener todos los eventos para el admin
router.get("/admin/todos", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ fechaCreacion: -1 });
    res.json(eventos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener eventos", error: error.message });
  }
});

export default router;
