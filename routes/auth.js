import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
// import passport from "../config/passport.js";
const router = express.Router();
import bcrypt from "bcryptjs";
import db from "../config/db.js";

const saltrounds = 10;

router.get("/login", (req, res) => {
  res.render("login.ejs", { msg: null });
});

router.post("/login", async (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/journal");
  }
  try {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        next(err);
      }
      if (!user) {
        return res.render("login.ejs", { msg: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/journal");
      });
    })(req, res, next);
  } catch (err) {
    console.log(err.message);
    res.render("login.ejs", { msg: "Something went wrong" });
  }
});

router.get("/register", (req, res) => {
  res.render("register.ejs", { msg: null });
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, fname, lname } = req.body;
    const d = new Date().toDateString();
    const result = await db.query(
      "SELECT * from users WHERE email=$1 OR username=$2",
      [email, username]
    );
    if (username.length < 6) {
      return res.render("register.ejs", {
        msg: "Username Should be atleast contain 6 characters",
      });
    }

    if (result.rows.length > 0) {
      return res.render("register.ejs", {
        msg: "User already exist! Try logging in or choose another username",
      });
    }
    const hashedpass = await bcrypt.hash(password, saltrounds);
    await db.query(
      "INSERT INTO users(username,email,password,fname,lname,date) VALUES($1,$2,$3,$4,$5,$6)",
      [username, email, hashedpass, fname, lname, d]
    );
    // console.log(username, hashedpass, email, password, fname, lname);
    res.render("login.ejs", { msg: null });
  } catch (error) {
    console.log(error.message);
    res.render("register.ejs", {
      msg: "Something Went wrong Try again later!!",
    });
  }
});

export default router;
