import express from "express";
import bodyParser from "body-parser";
import {Pool} from "pg";
import "dotenv/config"

const app = express();
const port = 3000;
const pool = new Pool({
  user: "postgres",
  hostname: "localhost",
  database: "Auth-Level_1",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {

    const checkResult = await pool.query("SELECT * FROM auth WHERE username=$1", [req.body.username]);

    if (checkResult.rows.length > 0) throw error;

    await pool.query("INSERT INTO auth VALUES ($1, $2)", [req.body.username, req.body.password]);
    res.render("secrets.ejs")
  } catch (error) {
    res.status(400).send("Email already exist! Try logging in!")
  }
});

app.post("/login", async (req, res) => {
  try {
    const results = await pool.query("SELECT pass FROM auth WHERE username=$1", [req.body.username]);

    if (results.rows.length < 1) throw error;

    console.log(results.rows);
    
    if (results.rows[0].pass == req.body.password) {
      res.render("secrets.ejs");
    } else {
      throw error;
    }

  } catch (error) {
    res.status(400).send("Email doesn't exist or password is incorrect!")
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
