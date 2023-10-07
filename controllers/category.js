const db = require('../helper/db');

const menu = [
    { name : "Home", url : "/"},
    { name : "Blog", url : "/blog", },
    { name : "Category", url : "/addCategory" }
]

exports.addCategory = (req, res) => {
    res.render("pages/category", {
        title : "Category",
        url : req.url,
        menu : menu,
    });
}
exports.saveCategory = async (req, res) => {
    try {
        const sql = "insert into category(name_category) values (?)";
        const [result] = await db.query(sql, [req.body.category_name]);
        req.flash("message", ["success", "Category add successfully"]);
        res.status(200).redirect("/");
    }catch (err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Error querying the database");
    }
}
exports.filter = async (req, res) => {
    let id = req.params.id
    try {
        const sql = "select b.* from blogs b inner join blog_category bc on b.id = bc.blog_id where bc.category_id = ?"
        const [blogRows] = await db.query(sql, [id])
        const [categoryRows] = await db.query("select * from category");
        res.render("pages/index", {
            title : "Home",
            url : req.url,
            menu : menu,
            blogs: blogRows,
            category: categoryRows,
            message : req.flash("message")
        })
    } catch(err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Error querying the database");
    }
}
exports.search = async (req, res) => {
    try {
        const sql = "select * from blogs where title like ?"
        const [searcBlog] = await db.query(sql, [`%${req.body.search}%`]);
        const [categoryRows] = await db.query("select * from category");
        res.render("pages/index", {
            title : "Home",
            url : req.url,
            menu : menu,
            blogs: searcBlog,
            category: categoryRows,
            message : req.flash('message')
        })
    } catch(err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Error querying the database");
    }
}