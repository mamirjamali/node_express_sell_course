const express = require('express');
const error = require('../middleware/error');
const courses = require('../routes/courses');
const users = require('../routes/users');
const authors = require('../routes/authors');
const home = require('../routes/home');
const auth = require('../routes/auth');

module.exports = function(app){
    app.use(express.json());
    app.set('view engine', 'pug');
    app.use('/api/courses', courses); 
    app.use('/api/users', users); 
    app.use('/api/authors', authors); 
    app.use('/api/auth', auth); 
    app.use('/', home);

    app.use(error);
}