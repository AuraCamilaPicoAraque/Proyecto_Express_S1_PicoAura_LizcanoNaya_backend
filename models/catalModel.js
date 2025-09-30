// Modelo de datos para el catálogo de películas, series y animes.
// Define la estructura y tipos de datos para cada entrada en el inventario.
export const catalogo = {
  collection: "inventario",
  schema: {
    _id: Number,
    categoria: String,          
    title: String,
    original_title: String,
    overview: String,
    original_language: String,
    year: Number,
    release_date: Date,
    popularity: Number,
    vote_average: Number,       
    vote_count: Number,         
    poster: String,
    backdrop: String,
    genres: [String],

    user_votes: {              
      average_rating: Number,
      vote_count: Number
    },

    createdAt: Date,
    approvedAt: Date
  }
};