const router = require('express').Router();
// const { query } = require('express-validator');
const controller = require('../controllers/main.controller');

router.get('/',controller.index);

module.exports = router;
