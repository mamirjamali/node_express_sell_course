const Joi = require("joi");
const mongoose = require('mongoose');
const {authorSchema} = require('./author');

const Course = mongoose.model('Course', new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        maxlength:255,
        minlength:3
    },
    category:{
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true
    },
    author: {
            type: new mongoose.Schema({
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
            }) 
        },
    tags: {
        type: Array,
    },
    date: {type: Date, default: Date.now},
    isPublished: Boolean,
    price: {
        type: Number,
        required: function(){ return this.isPublished},
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
  })
);

function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        category: Joi.string().required(),
        authorId: Joi.objectId(),
        tags: Joi.array().min(1).required(),
        isPublished: Joi.boolean().required(),
        price: Joi.number().min(2).required(),
    });
    return schema.validate(course);
}


exports.Course = Course;
exports.validate = validateCourse;