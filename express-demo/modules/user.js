const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require("joi-password-complexity");


const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        lowercase: true,
        maxlength:255,
        minlength:3,
        unique: true
    },
    name:{
        type: String,
    },
    email:{
        type: String,
        maxlength:255,
        minlength:5,
        required: true,
        unique: true
    },
    password:{
        type: String,
        maxlength:1024,
        minlength:3,
        required: true,
        unique: true
    },
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = Joi.object({
        userName: Joi.string().min(3).required(),
        name: Joi.string().min(3).required(),
        email: Joi.string().min(7).max(255)
               .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: new PasswordComplexity()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;