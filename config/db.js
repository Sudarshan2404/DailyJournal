import pkg from "pg";
import env from "dotenv";

// import postgres from "postgres";

// const connectionString = process.env.DATABASE_URL;
// const db = postgres(connectionString);

// export default db;

const { Client } = pkg;
env.config();

const db = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  // ssl: {
  //   rejectUnauthorized: false,
  //   sslmode: "require",
  // },
});

db.connect()
  .then(() => console.log("✅ Connected to Supabase Postgres"))
  .catch((err) => console.error("❌ DB connection error:", err));

export default db;
