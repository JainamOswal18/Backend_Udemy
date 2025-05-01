import express from "express";
import bodyParser from "body-parser";
import axios from "axios";


const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/random");
    const result = response.data;
  
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  console.log(req.body);

  const type = req.body.type;
  const noOfParticipants = req.body.participants;
  
  try {
    let response;
    
    if (type !== '' && noOfParticipants !== '') {      
      response = await axios.get(
        `http://localhost:5000/filter?type=${type}&participants=${noOfParticipants}`
      );
    } else if (type !== '') {
      response = await axios.get(`http://localhost:5000/filter?type=${type}`);
    } else if (noOfParticipants !== '') {
      response = await axios.get(`http://localhost:5000/filter?participants=${noOfParticipants}`);
    } else {
      response = await axios.get("http://localhost:5000/random");
      res.render("index", { data: response.data });
      return;
    }
    
    const results = response.data;
    const randomIndex = Math.floor(Math.random() * results.length);
    const result = results[randomIndex];
    
    res.render("index", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "No activities that match your criteria.",
    });
  }

  // Step 2: Play around with the drop downs and see what gets logged.
  // Use axios to make an API request to the /filter endpoint. Making
  // sure you're passing both the type and participants queries.
  // Render the index.ejs file with a single *random* activity that comes back
  // from the API request.
  // Step 3: If you get a 404 error (resource not found) from the API request.
  // Pass an error to the index.ejs to tell the user:
  // "No activities that match your criteria."
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
