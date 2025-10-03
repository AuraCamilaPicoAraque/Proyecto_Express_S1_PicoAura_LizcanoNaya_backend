// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

// Middleware hace para proteger rutas y verificar roles de usuario


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
    if (!token) {
      return res.status(401).json({ msg: "No autenticado" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { sub/id, role, ... }
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
}


export function optionalAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) return next();

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    // si hay token pero está mal, lo ignoramos para no romper rutas públicas
    next();
  }
}



// solo usuarios con role "admin"
// para rutas que requieren autenticación, usar antes requireAuth
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ msg: "No autenticado" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Acceso denegado: requiere admin" });
  }
  next();
}
