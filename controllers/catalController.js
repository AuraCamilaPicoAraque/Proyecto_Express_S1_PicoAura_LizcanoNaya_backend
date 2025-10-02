import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";



// obtiene todo el inventario para la pantalla principal
export const getinventario = async (req, res, next) => {
  try {
    const db = getDB();
    const items = await db.collection("inventario").find().toArray();
    console.log(items);
    res.json(items);
  } catch (err) {
    next(err);
  }
};



// obtenemos por categoria de inventario (peliculas, series, animes)
export const getByCategoria = async (req, res, next) => {
  try {
    const db = getDB();
    const { categoria  } = req.params;
    const items = await db.collection("inventario").find({ categoria }).toArray();
    res.json(items);
  } catch (err) {
    next(err);
  }
};



// obtenemos por ID de inventario
export const getById = async (req, res, next) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const item = await db.collection("inventario").findOne({ _id: new ObjectId(id) });

    if (!item) return res.status(404).json({ msg: "Elemento no encontrado" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};



// creamos un nuevo item en el inventario
export const createItem = async (req, res, next) => {
  try { 
    const db = getDB();
    const newItem = { ...req.body, createdAt: new Date() };
    const result = await db.collection("inventario").insertOne(newItem);
    res.status(201).json({ msg: "Elemento creado", id: result.insertedId });
  } catch (err) {
    next(err);
  }
};



// actualizamos un item del inventario
export const updateItem = async (req, res, next) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const result = await db.collection("inventario").updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ msg: "Elemento no encontrado" });
    }

    res.json({ msg: "Elemento actualizado" });
  } catch (err) {
    next(err);
  }
};



// eliminamos un item del inventario 
export const deleteItem = async (req, res, next) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const result = await db.collection("inventario").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Elemento no encontrado" });
    }

    res.json({ msg: "Elemento eliminado" });
  } catch (err) {
    next(err);
  }
};



// buscamos por título haciendo uso de query ?q= ya que puede ser parcial o completo
export const searchByTitle = async (req, res, next) => {
  try {
    const db = getDB();
    const { q } = req.query;

    if (!q) return res.status(400).json({ msg: "Debe enviar un término de búsqueda" });

    const results = await db.collection("inventario").find({
      title: { $regex: q, $options: "i" }
    }).toArray();

    res.json(results);
  } catch (err) {
    next(err);
  }
};



// filtramos por género para películas, series y animes
export const getByGenre = async (req, res, next) => {
  try {
    const db = getDB();
    const { genre } = req.params;

    const results = await db.collection("inventario").find({
      genres: genre
    }).toArray();

    res.json(results);
  } catch (err) {
    next(err);
  }
};