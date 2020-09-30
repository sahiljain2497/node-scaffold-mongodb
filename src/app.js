require('dotenv').config();
const config = require('better-config');

config.set('../config/config.json');
// done loading config
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./utils/logger');
const indexRoutes = require('./routes/index.routes');
const adminRoutes = require('./routes/admin.routes');
const db = require('./models');

const app = express();
// Set up Express components.
app.use(morgan('combined', { stream: logger.stream }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// enable cors
app.use(helmet());
app.options('*', cors());

// Serve the files statically from the 'public' folder.
app.use(express.static(path.join(__dirname, '../public')));

// Serve dynamic API routes with '/api/' path prefix.
app.get('/', (req, res) => res.send('WELCOME TO API HOME.'));
app.use('/api/v1', indexRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use((req, res) => res.status(404).send('ROUTE NOT FOUND.'));

// db connect
db.sequelize
	.authenticate()
	.then(() => {
		logger.info('sequelize db connected');
	})
	.catch((err) => {
		logger.error(err);
	});

if (process.env.NODE_ENV == 'development') {
	const routeprinter = require('../src/utils/routeprinter');
	routeprinter.init(app);
}

// Start the server.
app.listen(process.env.APP_PORT || 8080, () => {
	logger.info(`App listening on port ${process.env.APP_PORT || 8080}`);
});
