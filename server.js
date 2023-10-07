const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views")); 
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use("/", require("./router"));

app.listen(port, () => {
    console.log("heard on 8000");
});

