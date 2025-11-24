import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    titulo: { type: String, required: true, trim: true },
    tipo: { type: String, required: true, trim: true }, // riego, siembra, etc.
    fecha: { type: Date, required: true },
    responsable: { type: String, required: true, trim: true },
    estado: {
      type: String,
      enum: ["Pendiente", "Hoy", "Hecha"],
      default: "Pendiente",
    },
    lote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lote",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tarea", tareaSchema);
