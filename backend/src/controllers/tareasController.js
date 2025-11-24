import Tarea from "../models/Tarea.js";

// GET /api/tareas
export async function listarTareas(req, res) {
  try {
    const usuarioId = req.usuario._id;
    const tareas = await Tarea.find({ usuario: usuarioId })
      .populate("lote")
      .sort({ fecha: 1 });
    res.json(tareas);
  } catch (err) {
    console.error("Error al listar tareas:", err);
    res.status(500).json({ message: "Error al listar tareas" });
  }
}

// POST /api/tareas
export async function crearTarea(req, res) {
  try {
    const usuarioId = req.usuario._id;
    const { titulo, tipo, fecha, responsable, estado, lote } = req.body;

    if (!titulo || !tipo || !fecha || !responsable || !lote) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const nueva = await Tarea.create({
      usuario: usuarioId,
      titulo,
      tipo,
      fecha,
      responsable,
      estado: estado || "Pendiente",
      lote,
    });

    res.status(201).json(nueva);
  } catch (err) {
    console.error("Error al crear tarea:", err);
    res.status(500).json({ message: "Error al crear tarea" });
  }
}

// PUT /api/tareas/:id
export async function actualizarTarea(req, res) {
  try {
    const usuarioId = req.usuario._id;
    const { id } = req.params;
    const datos = req.body;

    const tarea = await Tarea.findOneAndUpdate(
      { _id: id, usuario: usuarioId },
      datos,
      { new: true }
    );

    if (!tarea) return res.status(404).json({ message: "No encontrada" });
    res.json(tarea);
  } catch (err) {
    console.error("Error al actualizar tarea:", err);
    res.status(500).json({ message: "Error al actualizar tarea" });
  }
}

// DELETE /api/tareas/:id
export async function eliminarTarea(req, res) {
  try {
    const usuarioId = req.usuario._id;
    const { id } = req.params;

    const tarea = await Tarea.findOneAndDelete({ _id: id, usuario: usuarioId });
    if (!tarea) return res.status(404).json({ message: "No encontrada" });
    res.json({ message: "Tarea eliminada" });
  } catch (err) {
    console.error("Error al eliminar tarea:", err);
    res.status(500).json({ message: "Error al eliminar tarea" });
  }
}
