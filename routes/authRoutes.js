/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios (solo administradores)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Devuelve una lista de todos los usuarios registrados. Solo los administradores pueden acceder.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []   # requiere token JWT
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado (token inválido o ausente)
 *       403:
 *         description: Acceso prohibido (se requiere rol admin)
 */

import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";
import { obtenerUsers } from "../controllers/userController.js";
import { register, loginCookie, loginToken, logoutController } from "../controllers/authController.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, obtenerUsers);
router.post("/register", register);        // POST /api/auth/register
router.post("/login", loginCookie);        // POST /api/auth/login (set-cookie)
router.post("/login-token", loginToken);   // POST /api/auth/login-token (JWT en body)
router.post("/logout", logoutController);  // POST /api/auth/logout

export default router;