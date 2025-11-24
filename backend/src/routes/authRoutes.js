import { Router } from "express";
import {
  registrar,
  login,
  getPerfil,
  actualizarPerfil,
  cambiarPassword,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registrar);
router.post("/login", login);

// Rutas que requieren estar logueado
router.get("/me", requireAuth, getPerfil);
router.put("/me", requireAuth, actualizarPerfil);
router.put("/password", requireAuth, cambiarPassword);

export default router;
