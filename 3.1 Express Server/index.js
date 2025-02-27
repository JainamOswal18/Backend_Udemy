import express from "express";
const app = express(); //This line creates an instance of an Express application by calling the express function. The app variable now holds this instance. This app instance is used to configure your application, set up middleware, define routes, and listen for incoming requests.

const port = 3000;

app.listen(port, () => {
    console.log(`Server Running On Port ${port}. `);
});