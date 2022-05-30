const {Author, validate} = require('../modules/author');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/******* CRUD Functions ***********/
//Post
async function createAuthor(reqbody){
    const author = new Author({
        name: reqbody.name,
        last_name: reqbody.last_name,
        bio: reqbody.bio,
        skills: reqbody.skills,
        isVerified: reqbody.isVerified,
     }
    );
    try{
        return await author.save();
    }
    catch(ex){
        for (field in ex.erros){
            return ex.errors[field].message
        }
        
    }
}
//Get
async function getAuthors(){
    const authors = await Author
      .find()
      .sort({name: 1})
      .select("name last_name bio")
    return authors;
}
//Update
async function updateAuthor(id, reqbody){
    return await Author.findByIdAndUpdate(id, {
        $set:{
            name: reqbody.name,
            last_name: reqbody.last_name,
            author: reqbody.author,
            skills: reqbody.skills,
            isVerified: reqbody.isVerified,
        }
    }, {new: true})
}
//Remove
async function removeAuthor(id){
    const result = await Author.deleteOne({_id: id});
    console.log(result)
}

/********* Routers ***********/
router.get('/', async (req, res) => {
    const authors = await getAuthors();
    res.send(authors);
});


router.get('/:id', async (req, res) => {
    const author = await Author.findById(req.params.id);

    if (!author ) return res.status(404).send(`The author with the id: ${req.params.id} was not found.`)
    
    res.send(author)
});


router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    return await createAuthor(req.body);
})


router.put('/:id', async (req, res) =>{
    const {error} = validate(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const author = await updateAuthor(req.params.id, req.body);

    if (!author ) return res.status(404).send(`The author with the id: ${req.params.id} was not found.`)
    
    res.send(author);
})

router.delete('/:id', async (req, res) => {
    const author = await removeAuthor(req.params.id);

    if (!author ) return res.status(404).send(`The author with the id: ${req.params.id} was not found.`)
    
    res.send(author);
})


module.exports = router;



