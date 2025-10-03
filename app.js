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
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const useCredentials = String(process.env.USE_CORS_CREDENTIALS || "true").toLowerCase() === "true";

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS: " + origin));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: useCredentials,
}));


// (Opcional) responder 204 a cualquier preflight que llegue hasta aquí
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

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
