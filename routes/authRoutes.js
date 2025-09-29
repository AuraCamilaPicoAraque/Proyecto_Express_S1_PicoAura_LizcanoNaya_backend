import { Router } from "express";
import { register, login } from "../controllers/authController.js";
const router = Router();

// Rutas de autenticación
// Registro y login de usuarios para obtener el token JWT.
router.post("/register", register);
router.post("/login", login);

export default router;
