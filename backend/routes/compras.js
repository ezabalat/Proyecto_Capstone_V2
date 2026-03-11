// backend/routes/compras.js
import express from "express";
import Compra from "../models/Compra.js";
import Evento from "../models/Evento.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

// Obtener todas las compras del usuario logueado
router.get("/mis-compras", verificarToken, async (req, res) => {
  try {
    const compras = await Compra.find({ usuario: req.usuario.id })
      .sort({ fechaCompra: -1 })
      .populate("evento");

    res.json(compras);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener compras", error: error.message });
  }
});

// Crear una nueva compra CON ZONA
router.post("/", verificarToken, async (req, res) => {
  try {
    const {
      eventoId,
      cantidad,
      zona, // NUEVO
      nombreComprador,
      dniComprador,
      emailComprador,
      telefonoComprador,
      ultimos4Digitos,
    } = req.body;

    // Validar datos del comprador
    if (
      !nombreComprador ||
      !dniComprador ||
      !emailComprador ||
      !telefonoComprador
    ) {
      return res
        .status(400)
        .json({ mensaje: "Todos los datos del comprador son requeridos" });
    }

    // Validar zona
    if (!zona || !["General", "VIP"].includes(zona)) {
      return res
        .status(400)
        .json({ mensaje: 'Zona inválida. Debe ser "General" o "VIP"' });
    }

    // Verificar que el evento existe
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    // Verificar disponibilidad según la zona
    const disponibles =
      zona === "General" ? evento.disponiblesGeneral : evento.disponiblesVIP;
    const precio = zona === "General" ? evento.precioGeneral : evento.precioVIP;

    if (disponibles < cantidad) {
      return res.status(400).json({
        mensaje: `Solo hay ${disponibles} entradas ${zona} disponibles`,
      });
    }

    if (cantidad < 1) {
      return res
        .status(400)
        .json({ mensaje: "La cantidad debe ser al menos 1" });
    }

    // Generar código único
    const codigoCompra =
      "TKT-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substr(2, 9).toUpperCase();

    // Calcular precio total
    const precioTotal = precio * cantidad;

    // Crear la compra
    const nuevaCompra = new Compra({
      usuario: req.usuario.id,
      evento: eventoId,
      nombreEvento: evento.nombre,
      fechaEvento: evento.fecha,
      lugarEvento: evento.lugar,
      zona, // NUEVO
      cantidad,
      precioUnitario: precio,
      precioTotal,
      nombreComprador,
      dniComprador,
      emailComprador,
      telefonoComprador,
      ultimos4Digitos: ultimos4Digitos || "****",
      codigoCompra,
      codigoQR: codigoCompra,
    });

    await nuevaCompra.save();

    // Actualizar disponibles según zona
    if (zona === "General") {
      evento.disponiblesGeneral -= cantidad;
    } else {
      evento.disponiblesVIP -= cantidad;
    }
    await evento.save();

    res.status(201).json({
      mensaje: "Compra realizada exitosamente",
      compra: nuevaCompra,
    });
  } catch (error) {
    console.error("Error al procesar compra:", error);
    res
      .status(500)
      .json({ mensaje: "Error al procesar compra", error: error.message });
  }
});

// Obtener detalle de una compra específica
router.get("/:id", verificarToken, async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id).populate("evento");

    if (!compra) {
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }

    if (compra.usuario.toString() !== req.usuario.id) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para ver esta compra" });
    }

    res.json(compra);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener compra", error: error.message });
  }
});

// Cancelar una compra
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id);

    if (!compra) {
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }

    if (compra.usuario.toString() !== req.usuario.id) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para cancelar esta compra" });
    }

    if (compra.estado === "cancelada") {
      return res.status(400).json({ mensaje: "Esta compra ya está cancelada" });
    }

    // Devolver entradas al evento según zona
    const evento = await Evento.findById(compra.evento);
    if (evento) {
      if (compra.zona === "General") {
        evento.disponiblesGeneral += compra.cantidad;
      } else {
        evento.disponiblesVIP += compra.cantidad;
      }
      await evento.save();
    }

    compra.estado = "cancelada";
    await compra.save();

    res.json({ mensaje: "Compra cancelada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al cancelar compra", error: error.message });
  }
});

export default router;
