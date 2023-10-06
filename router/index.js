const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const blogsController = require("../controllers/blogs");
const categoryController = require("../controllers/category");

// blogs
router.get('/', blogsController.index);
router.get("/blog", blogsController.addBlogPage);
router.post("/blog/saveblog",blogsController.uploadMiddleware, blogsController.saveBlog);
router.get("/singleBlog/:id", blogsController.singleBlog);
router.get("/updateBlog/:id", blogsController.updateBlog);
router.post("/saveUpdateBlog/:id", blogsController.uploadMiddleware, blogsController.saveUpdateBlog);
router.post("/deleteBlog/:id", blogsController.deleteBlog);

// category
router.get("/addCategory", categoryController.addCategory);
router.post("/saveblog", categoryController.saveCategory);

// filter
router.get("/category/:id", categoryController.filter);

module.exports = router;