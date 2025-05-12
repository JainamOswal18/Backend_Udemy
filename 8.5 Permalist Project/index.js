import express from "express";
import bodyParser from "body-parser";
import { Pool } from "pg"
import "dotenv/config"

const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  hostname: "localhost",
  database: "permalist",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {

  try {
    const results = await pool.query("SELECT * FROM items");
    console.log(results.rows);
    // items = results.rows;  -- i think i can optimize using this
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: results.rows,
    });
  } catch (error) {
    res.status(500).send("Something went wrong! Try again later!");
    console.log(error);
  }
});

app.post("/add", async (req, res) => {
  try {
    await pool.query("INSERT INTO items (title) VALUES ($1)", [req.body.newItem]);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Something went wrong!");
    console.log(error);
  }
});

app.post("/edit", async (req, res) => {
  console.log(req.body);

  try {
    await pool.query("UPDATE items SET title = $1 WHERE id = $2", [
      req.body.updatedItemTitle,
      req.body.updatedItemId,
    ]);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Something went wrong!");
    console.log(error);
  }

});

app.post("/delete", async (req, res) => {

  try {
    await pool.query("DELETE FROM items WHERE id = $1", [req.body.deleteItemId]);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Something went wrong!");
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
