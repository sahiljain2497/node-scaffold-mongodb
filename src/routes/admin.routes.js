const router = require('express').Router();
const cors = require('cors');
const controller = require('../controllers/admin/dashboard.controller');

const whitelist = [ 'https://www.gizmohlegacy.com' ];
if (process.env.NODE_ENV == 'development') {
	whitelist.push('http://localhost:3000');
	whitelist.push('http://gizmohlegacy.s3-website-us-east-1.amazonaws.com');
}
const corsOptions = {
	origin: function(origin, callback) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	}
};

router.get('/dashboard', controller.index);

module.exports = router;
