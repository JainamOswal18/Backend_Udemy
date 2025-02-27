import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>")
});

app.get("/about", (req, res) =>{
    res.send("<h2>I am Pune's tech rookie, mastering B.Tech while coding sites and plotting chess moves.</h2>");
});

app.get("/contact", (req, res) => {
    res.send("<h1>Email Me : jainamoswal1811@gmail.com</h1>")
});

app.listen(port, () => {
    console.log(`Server Running At Port : ${port}`);
});