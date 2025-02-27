import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

const yourUsername = "jainam";
const yourPassword = "jainam";
const yourAPIKey = "5b3a77d3-52bf-413a-b452-53dc7b1e9589";
const yourBearerToken = "06734dff-2e7f-4f4f-8ac8-94f6dc54974e";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  try { 
    const response = await axios.get(`${API_URL}random`);
    console.log(response.data);
    res.render("index.ejs", {
      content: JSON.stringify(response.data)
    });
  } catch (error) {
    res.status(400).send("Error", error.message)  
  }
});

app.get("/basicAuth", async (req, res) => {
  
  try {
    const response = await axios.get(`${API_URL}all`, {
      auth: {
        username: yourUsername,
        password: yourPassword,
      },
      params: {
        page: 2
      }
    });
  
    console.log(response.data);
    res.render("index.ejs", {
      content: JSON.stringify(response.data),
    });
  } catch (error) {
    res.status(400).send("Error", error.message);  
  }

  /*
  HINT: This is how you can use axios to do basic auth:
   https://stackoverflow.com/a/74632908
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
});

app.get("/apiKey", async (req, res) => {

  try {
    const response = await axios.get(`${API_URL}filter`, {
      params: {
        score: 5,
        apiKey: yourAPIKey
      }
    });
  
    console.log(response.data);
    res.render("index.ejs", {
      content: JSON.stringify(response.data),
    });
  } catch (error) {
    res.status(400).send("Error", error.message);  
  }

});

app.get("/bearerToken", async (req, res) => {

  try {
    const id = 42;
    const response = await axios.get(`${API_URL}secrets/${id}`, {
      headers: {
        Authorization: `Bearer ${yourBearerToken}`,
      }, 
    });
  
    console.log(response.data);
    res.render("index.ejs", {
      content: JSON.stringify(response.data),
    });
  } catch (error) {
    res.status(400).send("Error", error.message);  
  }

  /*
  HINT: This is how you can use axios to do bearer token auth:
   https://stackoverflow.com/a/52645402
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
