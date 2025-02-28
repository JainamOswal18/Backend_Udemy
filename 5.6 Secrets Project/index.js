import express from "express"
import axios from "axios"

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/", async (req, res) => {

    const response = await axios.get(
      "https://secrets-api.appbrewery.com/random"
    );
    console.log(response.data);
    

    res.render("index.ejs", {
        secret: response.data.secret,
        user: response.data.username
    });
});

app.listen(PORT, () => {
    console.log(`Server Listening at port: ${PORT}`);
});
