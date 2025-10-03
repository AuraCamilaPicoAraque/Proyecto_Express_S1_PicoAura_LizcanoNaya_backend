import { body } from "express-validator";
import bcrypt from "bcrypt";


// Validadores para el registro de usuario 
// Aseguran que el username no esté vacío, el email sea válido y la contraseña tenga al menos 3 caracteres
export const registerValidator = [
  body("username").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 3 })
]


// Validadores para el inicio de sesión
export const UserUtils = {
  trimAll(obj) {
    if (!obj || typeof obj !== "object") return obj;
    const o = { ...obj };
    Object.keys(o).forEach(k => {
      if (typeof o[k] === "string") o[k] = o[k].trim();
    });
    return o;
  },

  lowercase(s) {
    return typeof s === "string" ? s.toLowerCase() : s;
  },

  isPlainObject(v) {
    return Object.prototype.toString.call(v) === "[object Object]";
  },

  isValidEmail(v = "") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  },

  isValidUsername(v = "") {
    return /^[a-z0-9._-]{3,30}$/i.test(v);
  },

  isValidName(v = "") {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/.test(v);
  },

  isSafePassword(v = "") {
    // mínimo 6 (puedes subirlo a 8 si quieres)
    return typeof v === "string" && v.length >= 6;
  },

  isTimeString(v) {
    // "30m", "1h", "3600"…
    return typeof v === "string" && v.trim().length > 0;
  },

  throwError(status, message) {
    const e = new Error(message);
    e.status = status;
    throw e;
  },

  async hash(password) {
    return bcrypt.hash(password, 10);
  },

  async verify(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  },
};
