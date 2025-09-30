/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID de usuario
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         username: Juan Pérez
 *         email: juan@example.com
 *         role: user
 *         createdAt: 2025-09-29T10:00:00.000Z
 *
 *     UserRegister:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         username: juan123
 *         email: juan@example.com
 *         password: 123456
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: juan@example.com
 *         password: 123456
 */




import { getDB } from "../config/db.js";

// Controlador para obtener todos los usuarios
// Manejando asi los errores usando el middleware de manejo de errores
export const obtenerUsers = async (req, res, next) => {
  try {
    const db = getDB();
    const users = await db.collection("user").find().toArray();
    res.json(users);
  } catch (err) {
    next(err);
  }
};