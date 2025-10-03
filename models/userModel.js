import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";


// Definición del modelo de usuario
// Este modelo define la estructura de los documentos en la colección "user"
export const UserModel = {
  collection: "user",
  schema: {
    username: String,
    email: String,
    password: String,
    role: { type: String, default: "user" },
    createdAt: Date,
  }
};

// Clase para manejar operaciones relacionadas con usuarios

export class UserModelClass {
  constructor() { // nombre de la colección y proyecciones públicas
    this.collectionName = "user"; 
    this.publicProjection = { password: 0, createdAt: 0, updatedAt: 0 };  // campos a excluir en respuestas públicas
    this.publicProjectionHash = { projection: { password_hash: 0, password_updated_at: 0, created_at: 0, updated_at: 0 } }; // versión para findOne/find
  }

  col() {
    return getDB().collection(this.collectionName); // obtener la colección de usuarios
  }

  // buscar usuario por email (público)
  async findPublicByEmail(email) {
    return this.col().findOne({ email }, this.publicProjectionHash);
  }

  // buscar usuario por username (público)
  async findPublicByUsername(username) {
    return this.col().findOne({ username }, this.publicProjectionHash);
  }

  async findCredentialsByEmailStatusCode(email, status_code) {
    // si no manejas status_code aún, puedes omitirlo y buscar solo por email
    return this.col().findOne(
      { email, ...(status_code ? { status_code } : {}) },
      { projection: { email: 1, password_hash: 1, role: 1 } }
    );
  }

  // crear nuevo usuario
  async create(user) {
    return this.col().insertOne(user);
  }
  // buscar usuario por ID (público)
  async findPublicById(id) {
    return this.col().findOne({ _id: new ObjectId(id) }, this.publicProjectionHash);
  }
  // listar todos los usuarios (público)
  async listAll() {
    return this.col().find({}, this.publicProjectionHash).toArray();
  }
}

