/**
 *  @typedef {import('express').Request} Request
 *  @typedef {import('express').Response} Response
 */

const db = require('../helper/db');
const path = require("path");
const multer = require("multer");
const { validateBlog } = require('../helper/validator');
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
        const [blogRows] = await db.query("select * from blogs");
        const [categoryRows] = await db.query("select * from category");
        res.render("pages/index", {
            title: "Home",
            url: req.url,
            menu: menu,
            blogs: blogRows,
            category: categoryRows,
            message : req.flash("message")
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
        res.render("pages/singleBlog", {
            title : "Single Blog",
            url : req.url,
            menu : menu,
            singleBlog : singleBlog,
            blogCategories : blogCategories,
            message : req.flash("message")
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
            category : categoryRows,
            error : req.flash("error")
        });
    } catch (err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Error querying the database");
    }
}
exports.saveBlog = async (req, res) => {
    const {body} = req;
    let validate = {
        title : body.title,
        description : body.description,
        image : req.file,
        category : body.category
    }
    const connection = await db.getConnection();
    try {
        const {error, value} = validateBlog(validate);
        if (error) {
            req.flash("error", error.details[0].message);
            res.status(502).redirect("/blog");
        } else {
            const sql = `insert into blogs(title, description, blog_image) values (?, ?, ?)`;
            const sqlCat = "insert into blog_category values (?, ?)";
            await connection.beginTransaction();
            const [saveBlog] = await db.query(sql, [validate.title, validate.description, validate.image.filename])
            for (const catId of body.category) {
                await db.query(sqlCat, [saveBlog.insertId, catId]);
            }
            await connection.commit();
            req.flash("message", ["success", "Blog Add successfully"]);
            res.redirect("/");
        }
    } catch (err) {
        console.error("Error querying the database:", err);
        await connection.rollback();
        res.status(500).send("Error querying the database");
    }
}
exports.updateBlog = async (req, res) => {
    try {
        let id = req.params.id;
        const [singleBlog] = await db.query("select * from blogs where id = ?", [id]);
        const [category] = await db.query("select * from category");
        if (singleBlog.length > 0) {
            res.render("pages/updateBlog", {
                title : "Update Blog",
                url : req.url,
                menu : menu,
                blog : singleBlog,
                category : category,
                error : req.flash("error")
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
    const id = req.params.id;
    try {
        let img = req.file ? req.file.filename : null;
        const {body} = req;
        const validate = {
            title : body.title,
            description : body.description,
            image : "",
            category : body.category ? body.category : ""
        }
        const {error, value} = validateBlog(validate);
        if (error) {
            req.flash("error", error.details[0].message);
            res.status(502).redirect(`/updateBlog/${id}`);
        } else {
            if (!img) {
                const [blogImg] = await db.query("select blog_image from blogs where id = ?", [id]);
                if (blogImg && blogImg.length > 0) img = blogImg[0].blog_image;
            }
            if (validate.category) {
                await db.query("delete from blog_category where blog_id = ?", [id]);
                for (const catId of validate.category) {
                    await db.query("insert into blog_category values(?, ?)", [id, catId]);
                }
            }
            updateBlogImg();
            async function updateBlogImg() {
                const sql = "update blogs set title = ?, description = ?, blog_image = ? where id = ?";
                const [updated] = await db.query(sql, [validate.title, validate.description, img, id]);
                if (updated) {
                    req.flash('message', ["success", 'Blog updated success'])
                    res.status(200).redirect(`/singleBlog/${id}`);
                } else {
                    res.send("something wrong");
                }
            }
        }
    }catch (err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Error querying the database");
    }
}
exports.deleteBlog = async (req, res) => {
    const id = req.params.id;
    try {
        const [test] = await db.query("delete from blogs where id = ?", [id]);
        req.flash("message", ["success", "Blog deleted successfully"]);
        res.status(200).redirect("/");
    } catch (err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Error querying the database");
    }
}




