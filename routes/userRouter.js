// routes/userRouter.js

// Ruta protegida que solo los administradores pueden acceder
import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";
import { obtenerUsers } from "../controllers/userController.js";
const router = Router();

// GET /api/users - Obtener todos los usuarios (solo administradores)
router.get("/", requireAuth, requireAdmin, obtenerUsers);

export default router;