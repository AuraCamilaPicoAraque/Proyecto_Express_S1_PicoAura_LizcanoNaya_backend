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
  