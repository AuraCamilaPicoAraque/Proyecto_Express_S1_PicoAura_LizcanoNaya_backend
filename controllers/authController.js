// controllers/authController.js
import { UserService } from "../services/userService.js";
import { UserModelClass } from "../models/userModel.js";
import { getDB } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const service = new UserService();
const repo = new UserModelClass();


/* helpers */
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



/* registro */
export async function register(req, res, next) {
  try {
    const db = getDB();
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Faltan campos" });
    }

    const exists = await db.collection("user").findOne({ email });
    if (exists) return res.status(409).json({ msg: "El email ya está registrado" });

    // HASHEO AQUÍ
    const hashed = await bcrypt.hash(password, 10);

    const result = await db.collection("user").insertOne({
      username,
      email,
      password: hashed,   // <--- guarda el hash
      role: "user",
      createdAt: new Date()
    });

    res.status(201).json({ ok: true, id: result.insertedId });
  } catch (err) {
    next(err);
  }
}





/* login con cookie */
export async function loginCookie(req, res, next) {
  try {
    const { email, password } = req.body;
    const db = getDB();

    const user = await db.collection("user").findOne({ email });
    if (!user) return res.status(401).json({ msg: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password); // compara contra HASH
    if (!ok) return res.status(401).json({ msg: "Credenciales inválidas" });

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
      path: "/",
    });

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/* login que devuelve token */
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

    res.json({ ok: true, token });
  } catch (err) {
    next(err);
  }
}

/* /me usando cookie o Bearer */
export async function me(req, res, next) {
  try {
    // requireAuth ya puso req.user
    const db = getDB();
    const user = await db.collection("user").findOne({ _id: req.user.sub }, { projection: { password: 0 } });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json({ ok: true, document: user });
  } catch (err) {
    next(err);
  }
}

/* logout */
export async function logoutController(_req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.json({ ok: true });
};


