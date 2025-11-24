import Labor from "../models/Labor.js";

export async function listarLabores(req, res) {
  try {
    const usuarioId = req.usuario._id;
    const labores = await Labor.find({ usuario: usuarioId })
      .populate("lote")
      .sort({ fecha: -1 });
    res.json(labores);
  } catch (err) {
    console.error("Error al listar labores:", err);
    res.status(500).json({ message: "Error al listar labores" });
  }
}

export async function crearLabor(req, res) {
  try {
    const usuarioId = req.usuario._id;
    const { lote, fecha, categoria, insumo, dosis, costo } = req.body;

    if (!lote || !fecha || !categoria || !insumo || !dosis || costo == null) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const nueva = await Labor.create({
      usuario: usuarioId,
      lote,
      fecha,
      categoria,
      insumo,
      dosis,
      costo,
    });

    res.status(201).json(nueva);
  } catch (err) {
    console.error("Error al crear labor:", err);
    res.status(500).json({ message: "Error al crear labor" });
  }
}

export async function eliminarLabor(req, res) {
  try {
    const usuarioId = req.usuario._id;
    const { id } = req.params;

    const labor = await Labor.findOneAndDelete({ _id: id, usuario: usuarioId });
    if (!labor) return res.status(404).json({ message: "No encontrada" });
    res.json({ message: "Labor eliminada" });
  } catch (err) {
    console.error("Error al eliminar labor:", err);
    res.status(500).json({ message: "Error al eliminar labor" });
  }
}
