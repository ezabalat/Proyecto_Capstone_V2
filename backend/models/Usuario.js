// backend/models/Usuario.js
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    enum: ["usuario", "admin"],
    default: "usuario",
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Usuario", usuarioSchema);
