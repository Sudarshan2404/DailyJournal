import pkg from "pg";
import env from "dotenv";
const { Client } = pkg;
env.config();

const db = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: {
    rejectUnauthorized: false,
    sslmode: "require",
  },
});

db.connect();

export default db;
