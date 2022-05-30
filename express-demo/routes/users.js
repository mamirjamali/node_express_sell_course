const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config')
const {User, validate} = require('../modules/user');
const mongoose =  require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require("lodash");
const bcrypt = require('bcrypt');


async function createUser(reqbody){
    const user = new User(_.pick(reqbody, ['name', 'userName', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
    try{ 
        const newUser = await user.save()
        return  newUser;
    }
    catch(ex){
        for (field in ex.errors){
            return ex.errors[field].message
        }
    }
}
//Get
async function getUsers(){
    const users = await User
      .find()
      .sort({name: 1})
      .select('userName name -_id')
    return users;
}
//Update
async function updateUser(id, reqbody){
    return await User.findByIdAndUpdate(id, {
        $set:{
            name: reqbody.name,
            userName: reqbody.userName,
            email: reqbody.email,
            password: reqbody.password
        }
    }, {new: true})
}
//Remove
async function removeUser(id){
    const result = await User.deleteOne({_id: id});
    console.log(result)
}

/********* Routers ***********/
router.get('/', async (req, res) => {
    const users = await getUsers();
    res.send(users);
});


router.get('/me', auth, async (req, res) => {

    const user = await User.findById(req.user._id);  
    res.send(_.pick(user, ['name', 'userName']));
});


router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const user = await User.findOne({email: req.body.email, userName: req.body.userName})
    if(user) return res.status(400).send("User is already exists")

    const newUser = await createUser(req.body);
    
    const token = newUser.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(newUser, ['name', 'userName']));
})


router.put('/:id', async (req, res) =>{
    const {error} = validate(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const user = await updateUser(req.params.id, req.body);

    if (!user ) return res.status(404).send(`The user with the id: ${req.params.id} was not found.`)
    
    res.send(_.pick(user, ['name', 'userName']));;
})

router.delete('/:id', async (req, res) => {
    const user = await removeUser(req.params.id);

    if (!user ) return res.status(404).send(`The user with the id: ${req.params.id} was not found.`)
    
    res.send(_.pick(user, ['name', 'userName']));;
})


module.exports = router;

