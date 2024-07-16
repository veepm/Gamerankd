import pg from "pg";

const {Pool} = pg;

export const pool = new Pool({
  host: "localhost",
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: "5432",
  database: "project"
});
