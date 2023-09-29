const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const app = express(); // create an instance of the server
const port = 8000; // store the port that we gonna use on variable
const menu = [
    {
        name : "Home",
        url : "/"
    },
    {
        name : "Blog",
        url : "/blog",
    },
    {
        name : "Category",
        url : "/category"
    }
]

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public"))); // create an absolute path to the public folder
// view engine setup 
app.set("views", path.join(__dirname, "views")); // give you the all path of the folder views as a stringv
app.set('view engine', 'ejs'); // create the view engine and set that to ejs
// create get route for the route directory and render the index pages when url on /
app.get('/', (req, res) => {
    res.render('pages/index', {
        title : "Home",
        url : req.url,
        menu : menu,
    });
});
app.get("/blog", (req, res)=> {
    res.render("pages/blog", {
        title : "Blog",
        url : req.url,
        menu : menu,
    });
});
app.get("/category", (req, res)=> {
    res.render("pages/category", {
        title : "Category",
        url : req.url,
        menu : menu,
    });
});
app.listen(port, () => {
    console.log("heard on 8000");
});

