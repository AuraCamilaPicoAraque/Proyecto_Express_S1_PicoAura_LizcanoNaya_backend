import passport from "passport";

// Middleware hace para proteger rutas y verificar roles de usuario
export const requireAuth = passport.authenticate("jwt", { session: false });

// Middleware para verificar si el usuario tiene rol de administrador si no lo tiene no podra acceder a ciertas rutas y votara error 403
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ msg: "Acceso denegado - Solo administradores -----> https://http.cat/status/403" });
  }
  next();
};