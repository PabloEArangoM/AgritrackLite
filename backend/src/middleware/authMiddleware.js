import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

// Usamos el mismo secreto que en authController
const JWT_SECRET = process.env.JWT_SECRET || "DEV_SECRET_AGRITRACK";

export async function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id).select("_id nombre email");
    if (!usuario) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    req.usuario = usuario;
    next();
  } catch (err) {
    console.error("Error en requireAuth:", err);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
