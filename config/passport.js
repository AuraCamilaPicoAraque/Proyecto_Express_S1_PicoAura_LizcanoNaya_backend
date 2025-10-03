import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { getDB } from "./db.js";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
dotenv.config();


const cookieExtractor = (req) => req?.cookies?.token || null;


const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    cookieExtractor,
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: process.env.JWT_SECRET,
};


passport.use(
  new Strategy(opts, async (jwt_payload, done) => {
    try {
      const db = getDB();

      // OJO: tu token tiene "sub", no "id"
      const id = jwt_payload.sub;
      if (!id) return done(null, false);

      const user = await db.collection("user").findOne({ _id: new ObjectId(id) });
      if (user) return done(null, user);
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);
