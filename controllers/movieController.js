// importaa fetch para hacer peticiones HTTP
import fetch from "node-fetch";

export const getMovies = async (_req, res) => {
  try {
    const r = await fetch("https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1", {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`
      },
    });
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching TMDB API:", err);
    res.status(500).json({ error: "Error al obtener películas desde TMDB -> https://http.cat/status/500" });
  }
};
