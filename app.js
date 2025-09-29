import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { errorHandler } from "./middlewares/errorHandler.js";

import userRouter from "./routes/userRouter.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();    
const app = express();


app.use(express.json());


// Configuración de CORS
import "./config/passport.js";
app.use(passport.initialize());

// Rutas
app.use("/api/users", userRouter);
app.use("/api/auth", authRoutes);


// Middleware de manejo de errores
app.use(errorHandler);


export default app;