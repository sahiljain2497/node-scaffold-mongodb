const router = require('express').Router();
// const { query } = require('express-validator');
const controller = require('../controllers/auth.controller');

router.get('/login', controller.login);
router.get('/register', controller.register);

module.exports = router;
