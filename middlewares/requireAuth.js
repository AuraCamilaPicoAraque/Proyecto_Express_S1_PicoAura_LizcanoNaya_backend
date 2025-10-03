// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

function getToken(req) {
  const cookieToken = req.cookies?.token;
  if (cookieToken) return cookieToken;
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice("Bearer ".length).trim();
  return null;
}

export function requireAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ msg: "No autenticado" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // {_id, role}
    next();
  } catch {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ msg: "No autenticado" });
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Acceso denegado: requiere admin" });
  next();
}
