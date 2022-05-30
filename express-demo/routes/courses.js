const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObejectId = require('../middleware/validateObejectId');
const {Course, validate} = require('../modules/course');
const { Author } = require('../modules/author');
const mongoose = require('mongoose');
// const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

/******* CRUD Functions ***********/
//Post
//Using fawn for transaction
// Fawn.init(mongoose);

async function createCourse(reqbody, author){
    const course = new Course({
        name: reqbody.name,
        category: reqbody.category,
        author:{
            _id: author._id,
            name: author.name,
            last_name: author.last_name
        },
        tags: reqbody.tags,
        isPublished: reqbody.isPublished ,
        price: reqbody.price
     }
    );
    try{
        console.log(course);
        const newCourse = await course.save()
        return  newCourse;
    }
    catch(ex){
        for (field in ex.errors){
            return ex.errors[field].message
        }
    }
}
//Get
async function getCourses(){
    const courses = await Course
      .find()
      .sort({name: 1})
      .select('name author -_id')
    return courses;
}
//Update
async function updateCourse(id, reqbody){
    return await Course.findByIdAndUpdate(id, {
        $set:{
            name: reqbody.name,
            category: reqbody.category,
            author: reqbody.author,
            tags: reqbody.tags,
            isPublished: reqbody.isPublished,
            price: reqbody.price
        }
    }, {new: true})
}
//Remove
async function removeCourse(id){
    return await Course.deleteOne({_id: id});
}

/********* Routers ***********/
router.get('/', async (req, res) => {
    const courses = await getCourses();
    res.send(courses);
});


router.get('/:id', validateObejectId, async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course ) return res.status(404).send(`The course  with the id: ${req.params.id} was not found.`);

    res.send(course);
});


router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
   
    const author = await Author.findById(req.body.authorId)
    if(!author) return res.status(400).send('Invalid author.');
    const newCourse = await createCourse(req.body, author);
    res.send(newCourse);
})


router.put('/:id', async (req, res) =>{
    const {error} = validate(req.body);
    if (error){
        res.status(400).send(error.details[0].message);
        return;
    }
    const course = await updateCourse(req.params.id, req.body);

    if (!course ) return res.status(404).send(`The course with the id: ${req.params.id} was not found.`)
    
    res.send(course);
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const course = await removeCourse(req.params.id);

    if (!course ) return res.status(404).send(`The course with the id: ${req.params.id} was not found.`)
    
    res.send(`The course with the id: ${req.params.id} was Deleted.`);
})


module.exports = router;

