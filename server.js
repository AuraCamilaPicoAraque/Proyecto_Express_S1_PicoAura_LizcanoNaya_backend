import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { swaggerDocs } from "./swagger.js";

// Rutas
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";

dotenv.config();
const app = express();
app.use(express.json());

// Conexión a Mongo
connectDB();

// Rutas API
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

// Swagger Docs
swaggerDocs(app);

// Puerto dinámico (usa el del .env o el que le pase la plataforma)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
