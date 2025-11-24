import Lote from "../models/Lote.js";
import Tarea from "../models/Tarea.js";
import Labor from "../models/Labor.js";

// GET /api/lotes
export async function obtenerLotes(req, res) {
  try {
    const usuarioId = req.usuario._id;
    const lotes = await Lote.find({ usuario: usuarioId }).sort({ createdAt: -1 });
    res.json(lotes);
  } catch (err) {
    console.error("Error al obtener lotes:", err);
    res.status(500).json({ message: "Error al obtener lotes" });
  }
}

// POST /api/lotes
export async function crearLote(req, res) {
  try {
    const usuarioId = req.usuario._id;
    const { nombre, cultivo, fechaSiembra, estado } = req.body;

    if (!nombre || !cultivo || !fechaSiembra) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const nuevoLote = await Lote.create({
      usuario: usuarioId,
      nombre,
      cultivo,
      fechaSiembra,
      estado: estado || "Planeado",
    });

    res.status(201).json(nuevoLote);
  } catch (err) {
    console.error("Error al crear lote:", err);
    res.status(500).json({ message: "Error al crear el lote" });
  }
}

// PUT /api/lotes/:id
export async function actualizarLote(req, res) {
  try {
    const usuarioId = req.usuario._id;
    const { id } = req.params;
    const datos = req.body;

    const loteActualizado = await Lote.findOneAndUpdate(
      { _id: id, usuario: usuarioId },
      datos,
      { new: true }
    );

    if (!loteActualizado) {
      return res.status(404).json({ message: "Lote no encontrado" });
    }

    res.json(loteActualizado);
  } catch (err) {
    console.error("Error al actualizar lote:", err);
    res.status(500).json({ message: "Error al actualizar el lote" });
  }
}

// DELETE /api/lotes/:id
export async function eliminarLote(req, res) {
  try {
    const usuarioId = req.usuario._id;
    const { id } = req.params;

    // Primero borramos el lote del usuario
    const loteEliminado = await Lote.findOneAndDelete({
      _id: id,
      usuario: usuarioId,
    });

    if (!loteEliminado) {
      return res.status(404).json({ message: "Lote no encontrado" });
    }

    // Luego tareas y labores asociadas a ese lote y usuario
    await Tarea.deleteMany({ usuario: usuarioId, lote: loteEliminado._id });
    await Labor.deleteMany({ usuario: usuarioId, lote: loteEliminado._id });

    res.json({ message: "Lote y registros asociados eliminados" });
  } catch (err) {
    console.error("Error al eliminar lote:", err);
    res.status(500).json({ message: "Error al eliminar el lote" });
  }
}
