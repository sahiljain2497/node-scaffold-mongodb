const router = require('express').Router();
const controller = require('../controllers/admin/dashboard.controller');

router.get('/dashboard', controller.index);

module.exports = router;
