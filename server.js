import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Este servidor esta corriendo en http://localhost:${PORT} perfectamente`));
});