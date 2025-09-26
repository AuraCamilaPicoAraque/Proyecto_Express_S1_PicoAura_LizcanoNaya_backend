import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { errorHandler } from "./middlewares/errorHandler.js";

import userRouter from "./routes/userRouter.js";


dotenv.config();    
const app = express();


app.use(express.json());

import "./config/passport.js";
app.use(passport.initialize());

// Rutas
app.use("/api/users", userRouter);



// Middleware de manejo de errores
app.use(errorHandler);


export default app;