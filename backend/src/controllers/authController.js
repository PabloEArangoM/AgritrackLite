import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const JWT_SECRET = process.env.JWT_SECRET || "DEV_SECRET_AGRITRACK";

console.log("JWT_SECRET cargado:", JWT_SECRET ? "OK" : "VACÍO");

// POST /api/auth/register
export async function registrar(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, email, passwordHash });

    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (err) {
    console.error("Error en registrar:", err);
    res.status(500).json({ message: "Error al registrar" });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, usuario.passwordHash);
    if (!ok) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

// GET /api/auth/me  (info del usuario logueado)
export async function getPerfil(req, res) {
  const u = req.usuario;
  res.json({ id: u._id, nombre: u.nombre, email: u.email });
}

// PUT /api/auth/me  (actualizar nombre)
export async function actualizarPerfil(req, res) {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      { nombre },
      { new: true }
    ).select("_id nombre email");

    res.json({ message: "Perfil actualizado", usuario });
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
}

// PUT /api/auth/password  (cambiar contraseña)
export async function cambiarPassword(req, res) {
  try {
    const { actual, nueva } = req.body;
    if (!actual || !nueva) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const usuario = await Usuario.findById(req.usuario._id);
    const ok = await bcrypt.compare(actual, usuario.passwordHash);
    if (!ok) {
      return res.status(400).json({ message: "La contraseña actual no es correcta" });
    }

    usuario.passwordHash = await bcrypt.hash(nueva, 10);
    await usuario.save();

    res.json({ message: "Contraseña actualizada" });
  } catch (err) {
    console.error("Error al cambiar contraseña:", err);
    res.status(500).json({ message: "Error al cambiar contraseña" });
  }
}
