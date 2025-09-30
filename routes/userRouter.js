/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registro y autenticación de usuarios
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve un token JWT
 *       401:
 *         description: Credenciales inválidas
 */




// Ruta protegida que solo los administradores pueden acceder
import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";
import { obtenerUsers } from "../controllers/userController.js";

const router = Router();

// GET /api/users - Obtener todos los usuarios (solo administradores)
router.get("/", requireAuth, requireAdmin, obtenerUsers);

export default router;