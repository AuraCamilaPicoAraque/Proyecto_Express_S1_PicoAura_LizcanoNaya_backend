import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import { swaggerDocs } from "./swagger.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import userRouter from "./routes/userRouter.js";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRouter.js";

dotenv.config();

const app = express();
app.use(express.json());

app.set("json spaces", 2);

// CORS: permite tu frontend (5500 por defecto)
app.use(cors({
    origin: process.env.CORS_ORIGIN || "https://auracamilapicoaraque.github.io",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Passport
import "./config/passport.js";
app.use(passport.initialize());

// Docs
swaggerDocs(app);

// Rutas API
app.use("/api/users", userRouter);
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// Manejo de errores 
app.use(errorHandler);

export default app;
