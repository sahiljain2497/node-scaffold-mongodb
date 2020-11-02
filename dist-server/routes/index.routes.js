"use strict";

var router = require('express').Router();

var cors = require('cors');

var controller = require('../controllers/auth.controller');

var whitelist = ['https://www.gizmohlegacy.com'];

if (process.env.NODE_ENV == 'development') {
  whitelist.push('http://localhost:3000');
  whitelist.push('http://gizmohlegacy.s3-website-us-east-1.amazonaws.com');
}

var corsOptions = {
  origin: function origin(_origin, callback) {
    if (whitelist.indexOf(_origin) !== -1 || !_origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
router.get('/login', controller.login);
router.get('/register', controller.register);
module.exports = router;