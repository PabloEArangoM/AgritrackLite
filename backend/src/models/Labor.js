import mongoose from "mongoose";

const laborSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    lote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lote",
      required: true,
    },
    fecha: { type: Date, required: true },
    categoria: { type: String, required: true, trim: true },
    insumo: { type: String, required: true, trim: true },
    dosis: { type: String, required: true, trim: true },
    costo: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Labor", laborSchema);
