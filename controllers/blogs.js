/**
 *  @typedef {import('express').Request} Request
 *  @typedef {import('express').Response} Response
 */


const db = require('../helper/db');
const path = require("path");
const multer = require("multer");
const { check, validationResult } = require('express-validator');
const { exit } = require('process');

const menu = [
    { name : "Home", url : "/"},
    { name : "Blog", url : "/blog", },
    { name : "Category", url : "/addCategory" }
]

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "public/storage");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage : storage
})

exports.uploadMiddleware = upload.single("image");

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.index = async (req, res) => {
    try {
        // [] i do this to destract elements cuz there is elements and fields and i do it to get only array of elements no need for fields
        const [blogRows] = await db.query("select * from blogs");
        const [categoryRows] = await db.query("select * from category");
        res.render("pages/index", {
            title: "Home",
            url: req.url,
            menu: menu,
            blogs: blogRows,
            category: categoryRows,
        });
    } catch (err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Error querying the database");
    }

};
exports.singleBlog = async (req, res) => {
    try {
        let id = req.params.id;
        const [singleBlog] = await db.query("select * from blogs where id = ?", [id]);
        const [blogCategories] = await db.query(
            "select c.* from category c inner join blog_category bc on c.id = bc.category_id where bc.blog_id = ?",
            [id]
        );
        console.log(blogCategories);
        res.render("pages/singleBlog", {
            title : "Single Blog",
            url : req.url,
            menu : menu,
            singleBlog : singleBlog,
            blogCategories : blogCategories
        });
    } catch(err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Error querying the database");
    }
}
exports.addBlogPage = async (req, res) => {
    try {
        const [categoryRows] = await db.query("select * from category");
        res.render("pages/blog", {
            title : "Blog",
            url : req.url,
            menu : menu,
            category : categoryRows
        });
    } catch (err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Error querying the database");
    }
}
exports.saveBlog = async (req, res) => {
    console.log(req.body);
    const connection = await db.getConnection();
    try {
        let data = req.body;
        const sql = `insert into blogs(title, description, blog_image) values (?, ?, ?)`;
        const sqlCat = "insert into blog_category(blog_id, category_id) values (?, ?)";
        await connection.beginTransaction();
        const [saveBlog] = await db.query(sql, [data.title, data.description, req.file.filename])
        for (const catId of req.body.category) {
            const [saveCategory] = await db.query(sqlCat, [saveBlog.insertId, catId]);
        }
        res.redirect("/");
    } catch (err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Error querying the database");
    }
}
exports.updateBlog = async (req, res) => {
    try {
        let id = req.params.id;
        const [singleBlog] = await db.query("select * from blogs where id = ?", [id]);
        if (singleBlog.length > 0) {
            res.render("pages/updateBlog", {
                title : "Update Blog",
                url : req.url,
                menu : menu,
                blog : singleBlog
            });
        } else {
            res.status(500).send("something wrong");
        }
    } catch(err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Error querying the database");
    }
    
}
exports.saveUpdateBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let img = req.file ? req.file.filename : null;
        if (!img) {
            const [blogImg] = await db.query("select blog_image from blogs where id = ?", [id]);
            if (blogImg && blogImg.length > 0) img = data[0].blog_image;
            updateBlogImg();
        } else {
            updateBlogImg();
        }
        res.status(200).redirect("/");
        async function updateBlogImg() {
            const sql = "update blogs set title = ?, description = ?, blog_image = ? where id = ?";
            const [updated] = await db.query(sql, [data.title, data.description, img, id]);
            if (updated) {
                console.log("Updated successfully");
            } else {
                res.send("something wrong");
            }
        }
    }catch (err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Error querying the database");
    }
}
exports.deleteBlog = (req, res) => {
    const id = req.params.id;
    const sql = "delete from blogs where id = ?";
    db.query(sql, [id], (err, data) => {
        if (err) throw err;
        res.json("Blog deleted");
    })
}




