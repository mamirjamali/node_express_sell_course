const Joi = require("joi");
const mongoose = require('mongoose');


const authorSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        maxlength:255,
        minlength:3
    },
    last_name: {
        type: String, 
        required: true,
        maxlength:255,
        minlength:3
    },
    bio: {
        type: String, 
        maxlength:255,
        minlength:3
    },
    skiils: {
        required: true,
        type: Array
    },
    isVerified: Boolean,
  });
const Author = mongoose.model('Author', authorSchema);

function validateAuthor(author){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required(),
        bio: Joi.string().min(3),
        skills: Joi.array().min(1).required(),
        isVerified: Joi.boolean(),
    });
    return schema.validate(author);
}


exports.Author = Author;
exports.authorSchema = authorSchema;
exports.validate = validateAuthor;