import pg from "pg";

const {Pool} = pg;

export const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  ssl: process.env.PG_HOST === "localhost" ? false : true
});
