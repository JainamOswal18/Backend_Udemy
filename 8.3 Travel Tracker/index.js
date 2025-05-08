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

async function checkVisisted() {
  const results = await pool.query("SELECT country_code FROM visited_countries");
  let countries = [];
  results.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(countries);

  return countries;
}

app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  res.render("index.ejs", { total: countries.length, countries: countries });
});
 
app.post("/add", async (req, res) => {
  
  try {
    const country = req.body.country;

    const results = await pool.query(
      "SELECT country_code FROM countries WHERE country_name ILIKE '%' || $1 || '%'",
      [country]
    );
    console.log(results.rows);

    var country_code = results.rows[0].country_code;

    try {
      await pool.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [country_code]
      );
      res.redirect("/");
    
    } catch (err) {
      console.log(err);
      const countries = await checkVisisted();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again!",
      });
    }

  } catch (err) {
    console.log(err);
    const countries = await checkVisisted();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again!"
    });
  }

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
