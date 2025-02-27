import express from "express";
import ejs from "ejs";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    
    const d = new Date();
    let day = d.getDay();

    var dayType = "Weekday";
    var advice = "work hard!";

    if (day == 0 || day == 6) {
        dayType = "Weekend";
        advice = "have fun!";
    } 
    res.render("index.ejs", {
        day: dayType,
        toDo: advice
    });
});

app.listen(port, () => {
   console.log(`Listening On Port ${port}`); 
});