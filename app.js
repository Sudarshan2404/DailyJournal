import express, { Router } from "express";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import pg from "pg";
import env from "dotenv";
import authroutes from "./routes/auth.js";
import journalroutes from "./routes/journal.js";
import db from "./config/db.js";
import initialize from "./config/passport.js";

env.config();

const app = express();
const port = 3000;
const saltrounds = 10;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// session
initialize(passport);
app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

// Routes
app.use("/auth", authroutes);
app.use("/journal", journalroutes);

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/journal");
  }
  res.redirect("/auth/login");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
