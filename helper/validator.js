const Joi = require("joi");

const validator = (schema) => (payload) => schema.validate(payload);

const blogSchema = Joi.object({
    title : Joi.string().required().min(3),
    description : Joi.string().required(),
    image : Joi.required(),
    category : Joi.required()
})

exports.validateBlog = validator(blogSchema);


