// backend/models/Compra.js
import mongoose from "mongoose";

const compraSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  evento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Evento",
    required: true,
  },
  nombreEvento: {
    type: String,
    required: true,
  },
  fechaEvento: {
    type: Date,
    required: true,
  },
  lugarEvento: {
    type: String,
    required: true,
  },
  // NUEVO: Zona seleccionada
  zona: {
    type: String,
    enum: ["General", "VIP"],
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
  },
  precioUnitario: {
    type: Number,
    required: true,
  },
  precioTotal: {
    type: Number,
    required: true,
  },
  // Datos del comprador
  nombreComprador: {
    type: String,
    required: true,
  },
  dniComprador: {
    type: String,
    required: true,
  },
  emailComprador: {
    type: String,
    required: true,
  },
  telefonoComprador: {
    type: String,
    required: true,
  },
  // Datos de pago
  metodoPago: {
    type: String,
    default: "Tarjeta de Crédito",
  },
  ultimos4Digitos: {
    type: String,
  },
  fechaCompra: {
    type: Date,
    default: Date.now,
  },
  estado: {
    type: String,
    enum: ["completada", "cancelada"],
    default: "completada",
  },
  codigoCompra: {
    type: String,
    required: true,
    unique: true,
  },
  codigoQR: {
    type: String,
  },
});

export default mongoose.model("Compra", compraSchema);
