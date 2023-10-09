const Joi = require("joi");

const validator = (schema) => (payload) => schema.validate(payload);

const blogSchema = Joi.object({
    title : Joi.string().required().min(3),
    description : Joi.string().required(),
    image : Joi.required(),
    category : Joi.required()
})
const categorySchema = Joi.object({
    category_name : Joi.string().required()
})

exports.validateBlog = validator(blogSchema);
exports.validateCategory = validator(categorySchema);

