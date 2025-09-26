// Middleware para manejar errores
// Este middleware captura errores y envía una respuesta adecuada al cliente
export const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
      msg: err.message || "Error interno del servidor  --> https://http.cat/status/500",
    });
  };
  