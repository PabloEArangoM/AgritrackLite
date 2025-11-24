import { Router } from "express";
import {
  obtenerLotes,
  crearLote,
  actualizarLote,
  eliminarLote,
} from "../controllers/lotesController.js";

const router = Router();

router.get("/", obtenerLotes);
router.post("/", crearLote);
router.put("/:id", actualizarLote);
router.delete("/:id", eliminarLote);

export default router;
