const express = require("express");
const app = express();
const port = 5000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

const router = require("./router/routes");
app.use("/", router);

app.listen(port);