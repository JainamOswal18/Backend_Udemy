import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
var bandName = "";

function bandNameGenerator(req, res, next) {
  bandName = req.body["street"] + req.body["pet"]
  next();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bandNameGenerator);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  var streetName = req.body["street"]; //or req.body.street
  var petName = req.body["pet"]; //or req.body.pet
  res.send(`<h1>Your Band Name Is : </h1> <h2>${streetName + petName}</h2>`);
  // res.send(`<h1>Your Band Name Is : </h1> <h2>${bandName}</h2>`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
