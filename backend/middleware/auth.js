import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "mi_clave_secreta_super_segura_12345";

export const verificarToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ mensaje: "Acceso denegado. Token no proporcionado." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

// Middleware para verificar que sea administrador
export const verificarAdmin = (req, res, next) => {
  // Cambiar 'rol' por 'tipo' para que coincida con tu modelo
  if (req.usuario.tipo !== "admin") {
    return res.status(403).json({
      mensaje:
        "Acceso denegado. Solo administradores pueden realizar esta acción.",
    });
  }
  next();
};
