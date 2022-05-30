const {User} = require('../modules/user');
const mongoose =  require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require("lodash");
const bcrypt = require('bcrypt');
const Joi = require('joi');
const PasswordComplexity = require("joi-password-complexity");


/********* Routers ***********/
router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const user = await User.findOne({email: req.body.email})
    // const user = await User.findOne({email: req.body.email, userName: req.body.userName})
    if(!user) return res.status(400).send("Invalid email or password")
    
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send("Invalid email or password")
    
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(`Hi ${user.name} your are logged in`);

})


function validate(req){
    const schema = Joi.object({
        // userName: Joi.string().min(3).required(),
        email: Joi.string().min(7).max(255)
               .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: new PasswordComplexity()
    });
    return schema.validate(req);
}

module.exports = router;

