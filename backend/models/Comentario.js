// backend/models/Comentario.js
import mongoose from "mongoose";

const comentarioSchema = new mongoose.Schema(
  {
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
    contenido: {
      type: String,
      required: true,
      maxlength: 500,
    },
    calificacion: {
      type: Number,
      min: 1,
      max: 5,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
    activo: {
      type: Boolean,
      default: true,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

comentarioSchema.index({ evento: 1, fechaCreacion: -1 });

export default mongoose.model("Comentario", comentarioSchema);
