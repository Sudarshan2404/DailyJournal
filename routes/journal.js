import express, { Router } from "express";
import bodyParser from "body-parser";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const date = new Date();
    const d = date.toISOString().split("T")[0];
    const result = await db.query(
      "SELECT * FROM entries WHERE user_id=$1 AND date=$2",
      [req.user.id, d]
    );
    const time = date.getHours();
    let greet;
    const user = await db.query("SELECT * FROM users WHERE id=$1", [
      req.user.id,
    ]);
    const u = user.rows[0];
    if (time >= 5 && time < 12) {
      greet = "Good Morning," + " " + u.fname;
    } else if (time >= 12 && time < 18) {
      greet = "Good Afternoon, " + u.fname;
    } else if (time >= 18 && time < 22) {
      greet = "Good Evening," + " " + u.fname;
    } else {
      greet = "Have a Good Night," + " " + u.fname;
    }
    const mindate = new Date(u.date).toISOString().split("T")[0];
    if (result.rows.length === 0) {
      const message = "Create your first entry " + u.fname;
      return res.render("journal.ejs", {
        user: greet,
        msg: message,
        mindate: mindate,
        maxdate: d,
        today: d,
      });
    }
    console.log(req.user.id);
    res.render("journal.ejs", {
      user: greet,
      entry: result.rows,
      msg: null,
      mindate: mindate,
      maxdate: d,
      today: d,
    });
  } else {
    res.redirect("/");
  }
});

router.post("/create", async (req, res) => {
  try {
    const title = req.body.title;
    const entry = req.body.entry;
    const date = new Date();
    const d = date.toLocaleDateString();
    const id = req.user.id;
    await db.query(
      "INSERT INTO entries (title, entry, user_id, date) VALUES($1,$2,$3,$4)",
      [title, entry, id, d]
    );
    res.redirect("/journal");
  } catch (error) {
    console.log(error);
    res.redirect("/?msg:Something went wrong");
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    await db.query("DELETE FROM entries WHERE id=$1", [id]);
    res.redirect("/");
  } catch (error) {
    res.redirect("/?msg:Something went wrong");
  }
});

router.get("/filter", async (req, res) => {
  if (req.isAuthenticated()) {
    const d = req.query.date;
    const date = new Date();
    const de = date.toISOString().split("T")[0];
    const result = await db.query(
      "SELECT * FROM entries WHERE user_id=$1 AND date=$2",
      [req.user.id, d]
    );
    const time = date.getHours();
    let greet;
    const user = await db.query("SELECT * FROM users WHERE id=$1", [
      req.user.id,
    ]);
    const u = user.rows[0];
    if (time >= 5 && time < 12) {
      greet = "Good Morning," + " " + u.fname;
    } else if (time >= 12 && time < 18) {
      greet = "Good Afternoon, " + u.fname;
    } else if (time >= 18 && time < 22) {
      greet = "Good Evening," + " " + u.fname;
    } else {
      greet = "Have a Good Night," + " " + u.fname;
    }
    const mindate = new Date(u.date).toISOString().split("T")[0];
    if (result.rows.length === 0) {
      const message = "No Entry Found for the Selected Date ";
      return res.render("journal.ejs", {
        user: greet,
        msg: message,
        mindate: mindate,
        maxdate: de,
        today: d,
      });
    }
    console.log(req.user.id);
    res.render("journal.ejs", {
      user: greet,
      entry: result.rows,
      msg: null,
      mindate: mindate,
      maxdate: de,
      today: d,
    });
  } else {
    res.redirect("/");
  }
});

export default router;
