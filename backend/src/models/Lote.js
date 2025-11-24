import mongoose from "mongoose";

const loteSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    cultivo: {
      type: String,
      required: true,
      trim: true,
    },
    fechaSiembra: {
      type: Date,
      required: true,
    },
    estado: {
      type: String,
      enum: ["Planeado", "En proceso", "Cosechado"],
      default: "Planeado",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lote", loteSchema);
