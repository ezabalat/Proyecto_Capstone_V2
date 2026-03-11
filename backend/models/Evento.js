// backend/models/Evento.js
import mongoose from "mongoose";

const eventoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  lugar: {
    type: String,
    required: true,
  },
  // Precios por zona
  precioGeneral: {
    type: Number,
    required: true,
  },
  precioVIP: {
    type: Number,
    required: true,
  },
  // Capacidad por zona
  capacidadGeneral: {
    type: Number,
    required: true,
  },
  capacidadVIP: {
    type: Number,
    required: true,
  },
  // Disponibles por zona
  disponiblesGeneral: {
    type: Number,
    required: true,
  },
  disponiblesVIP: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  imagen: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500",
  },
  // Imagen del mapa del escenario
  imagenMapa: {
    type: String,
    default: "",
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Evento", eventoSchema);
