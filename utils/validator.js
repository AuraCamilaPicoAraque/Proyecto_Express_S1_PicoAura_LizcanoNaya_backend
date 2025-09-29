import { body } from "express-validator";

// Validadores para el registro de usuario 
// Aseguran que el username no esté vacío, el email sea válido y la contraseña tenga al menos 3 caracteres
export const registerValidator = [
  body("username").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 3 })
]