// backend/models/Artista.js
import mongoose from "mongoose";

const artistaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    nombreArtistico: {
      type: String,
      required: true,
      trim: true,
    },
    biografia: {
      type: String,
      required: true,
    },
    generoMusical: [
      {
        type: String,
        required: true,
      },
    ],
    foto: {
      type: String,
      default: "default-artist.jpg",
    },
    redesSociales: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
      spotify: String,
      tiktok: String,
    },
    informacionPersonal: {
      fechaNacimiento: Date,
      lugarNacimiento: String,
      telefono: String,
      email: String,
    },
    eventos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evento",
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

export default mongoose.model("Artista", artistaSchema);
