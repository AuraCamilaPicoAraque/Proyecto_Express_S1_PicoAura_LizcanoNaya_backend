// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDB } from "../config/db.js";

/* ========== Helpers ========== */
async function findUserByEmail(email) {
  const db = getDB();
  return db.collection("user").findOne({ email });
}

async function validateCredentials(email, password) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  return ok ? user : null;
}

/* ========== Registro ========== */
export const register = async (req, res, next) => {
  try {
    const db = getDB();
    const { username, email, password } = req.body;

    // opcional: validar duplicados
    const exists = await db.collection("user").findOne({ email });
    if (exists) return res.status(409).json({ msg: "El email ya está registrado" });

    const hashed = await bcrypt.hash(password, 10);
    const result = await db.collection("user").insertOne({
      username,
      email,
      password: hashed,
      role: "user",
      createdAt: new Date(),
    });

    res.status(201).json({ msg: "Usuario registrado", id: result.insertedId });
  } catch (err) {
    next(err);
  }
};

/* ========== Login que SETEA COOKIE (recomendado para web) ========== */
export async function loginCookie(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await validateCredentials(email, password);
    if (!user) return res.status(401).json({ msg: "Credenciales inválidas" });

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1h" }
    );

    // Cookie cross-site para GitHub Pages -> Render
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,      // Necesita HTTPS y app.set('trust proxy', 1)
      sameSite: "none",  // Requerido para cross-site
      maxAge: 1000 * 60 * 60,
      path: "/",
    });

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/* ========== Login que DEVUELVE TOKEN (opcional) ========== */
export async function loginToken(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await validateCredentials(email, password);
    if (!user) return res.status(401).json({ msg: "Credenciales inválidas" });

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1h" }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
}

/* ========== Logout ========== */
export async function logoutController(_req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.json({ ok: true });
}
