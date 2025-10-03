// scripts/hash-passwords.js
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
const DB = process.env.MONGO_DB || "karenflix";

function looksHashed(pw) {
  return typeof pw === "string" && pw.startsWith("$2");
}

try {
  await client.connect();
  const db = client.db(DB);
  const col = db.collection("user");

  const cursor = col.find({});
  let updated = 0;
  let total = 0;

  while (await cursor.hasNext()) {
    const u = await cursor.next();
    total++;
    if (u?.password && !looksHashed(u.password)) {
      const hashed = await bcrypt.hash(u.password, 10);
      await col.updateOne({ _id: u._id }, { $set: { password: hashed } });
      console.log(`Hasheada contraseña de: ${u.email || u._id}`);
      updated++;
    }
  }

  console.log(`Listo. Revisados: ${total}. Actualizados: ${updated}.`);
} catch (e) {
  console.error("Error en migración:", e);
  process.exitCode = 1;
} finally {
  await client.close();
}
