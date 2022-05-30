const winston = require('winston');

require('express-async-errors');

module.exports = function(){
    //In app logs
    winston.add(new winston.transports.File({ filename: './logs/logfile.log' }));
    
    //Exception errors - sync methods
    winston.exceptions.handle(
        new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/exceptions.log' })
    );
    
    //Exception errors - async methods
    winston.add(new winston.transports.File({
        filename: './logs/rejections.log',
        handleRejections: true
    }));
}