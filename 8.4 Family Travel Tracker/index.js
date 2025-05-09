import express from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";
import "dotenv/config"

const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

// let users = [
//   { id: 1, name: "Angela", color: "teal" },
//   { id: 2, name: "Jack", color: "powderblue" },
// ];

async function fetchAllUsers() {
  const result = await pool.query("SELECT * FROM family_members ORDER BY id ASC");

  console.log(result.rows);
  return result.rows;
}

async function checkVisisted(userId) {
  const result = await pool.query("SELECT country_code FROM visited_countries WHERE user_id = $1", [userId]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(countries);
  return countries;
}
app.get("/", async (req, res) => {
  const countries = await checkVisisted(currentUserId);
  const users = await fetchAllUsers();
  const currentUser = users.find((user) => user.id == currentUserId);

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUser?.color || 'teal',
  });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await pool.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await pool.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await checkVisisted(currentUserId);
      const users = await fetchAllUsers();
      const currentUser = users.find((user) => user.id == currentUserId);

      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again!",
        users: users,
        color: users[currentUserId - 1].color,
      });
    }
  } catch (err) {
    console.log(err);
    const countries = await checkVisisted(currentUserId);
    const users = await fetchAllUsers();
    const currentUser = users.find((user) => user.id == currentUserId);

    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again!",
      users: users,
      color: users[currentUserId - 1].color,
    });
  }
});
app.post("/user", async (req, res) => {
  if (req.body.add == 'new') {
    res.render("new.ejs")
  } else if (req.body.user) {
    currentUserId = req.body.user;
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  const results = await pool.query("INSERT INTO family_members (name, color) VALUES ($1, $2) RETURNING *", [req.body.name, req.body.color]);

  currentUserId = results.rows[0].id;

  res.redirect("/");
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
