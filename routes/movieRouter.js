import express from "express";
import fetch from "node-fetch";
import { getMovies } from "../controllers/movieController.js";


const router = express.Router();
router.get("/", getMovies);

// /api/movies  -> aquí solo "/"
router.get("/", async (_req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1`;
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_TOKEN}` // usa el nombre del .env real
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `TMDB error: ${response.status}`, body: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error en el proxy:", error);
    res.status(500).json({ error: "Error al obtener películas https://http.cat/status/500" });
  }
});

export default router;
