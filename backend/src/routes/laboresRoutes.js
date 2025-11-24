import { Router } from "express";
import {
  listarLabores,
  crearLabor,
  eliminarLabor,
} from "../controllers/laboresController.js";

const router = Router();

router.get("/", listarLabores);
router.post("/", crearLabor);
router.delete("/:id", eliminarLabor);

export default router;
