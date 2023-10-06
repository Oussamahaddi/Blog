const express = require("express");
const expressLayouts = require("express-ejs-layouts");
// const multer = require("multer");
const path = require("path");
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(multer().none());

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views")); 
app.set('view engine', 'ejs');

app.use("/", require("./router"));

app.listen(port, () => {
    console.log("heard on 8000");
});

