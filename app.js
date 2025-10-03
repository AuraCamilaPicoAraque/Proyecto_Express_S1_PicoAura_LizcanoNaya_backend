import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import { swaggerDocs } from "./swagger.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import userRouter from "./routes/userRouter.js";
import authRoutes from "./routes/authRoutes.js";
import catalogoRoutes from "./routes/catalRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.set("json spaces", 2);
app.set("trust proxy", 1);

// CORS

const options = {
    origin: 'https://naya741.github.io',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 204
};

app.use(cors(options));

app.use((req, res, next) => { if (req.method === 'OPTIONS') return res.sendStatus(204); next(); });

// Passport
import "./config/passport.js";
app.use(passport.initialize());

// Docs
swaggerDocs(app);

// Rutas
app.use("/api/users", userRouter);
app.use("/api/auth", authRoutes);
app.use("/api/catalogo", catalogoRoutes);

// Errores
app.use(errorHandler);

export default app;





