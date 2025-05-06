import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import { Pool } from "pg";

const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  hostname: "localhost",
  database: "world",
  password: process.env.DB_PASSWORD,
  port: 5432
});   

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const results = await pool.query("SELECT country_code FROM visited_countries");
  let countries = [];
  results.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(countries);

  res.render("index.ejs", { total: countries.length, countries: countries });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
