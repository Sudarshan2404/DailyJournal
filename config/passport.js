import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

function initialize(passport) {
  passport.use(
    new LocalStrategy(async function verify(username, password, cb) {
      try {
        const result = await db.query("SELECT * FROM users WHERE username=$1", [
          username,
        ]);

        if (result.rows.length === 0) {
          return cb(null, false, {
            message: "User not found please register",
          });
        }

        const user = result.rows[0];
        const passwordmtch = await bcrypt.compare(password, user.password);
        if (!passwordmtch) {
          return cb(null, false, {
            message: "Invalid password or username",
          });
        }
        return cb(null, user);
      } catch (error) {
        console.log(error.message);
      }
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser(async (id, cb) => {
    try {
      const result = await db.query("SELECT * FROM users WHERE id=$1", [id]);
      if (result.rows.length > 0) {
        cb(null, result.rows[0]);
      } else {
        cb(new Error("User not found"));
      }
    } catch (err) {
      cb(err);
    }
  });
}
export default initialize;
