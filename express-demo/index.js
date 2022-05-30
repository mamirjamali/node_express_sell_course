const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/validation')(); 
require('./startup/prod');

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

const port = process.env.PORT || 8700;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`))

module.exports = server;
