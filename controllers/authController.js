import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDB } from "../config/db.js";

// Controlador para el registro de usuario
// creamos un registro que guarda el usuario en la base de datos con una contraseña hasheada y devuelve un status 201 si el registro es exitoso https://http.cat/status/201
export const register = async (req, res, next) => {
  try {
    const db = getDB();
    const { username, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    const result = await db.collection("user").insertOne({
      username, email, password: hashed, role: "user", createdAt: new Date()
    });

    res.status(201).json({ msg: "El usuario a sido registrado exitosamente. https://http.cat/status/201", id: result.insertedId });
  } catch (err) {
    next(err);
  }
};




// Controlador para el login de usuario
// creamos un login que verifica las credenciales del usuario y genera un token JWT si son correctas ademas con status 401 si no son correctas
export const login = async (req, res, next) => {
  try {
    const db = getDB();
    const { email, password } = req.body;

    const user = await db.collection("user").findOne({ email });
    if (!user) return res.status(401).json({ msg: "Ingreso invalido, intentalo denuevo" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Ingreso invalido, intentalo denuev" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
