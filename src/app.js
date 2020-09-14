require('dotenv').config();
const config = require('better-config');
config.set('../config/config.json');

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const logger = require('./utils/logger');
const routes = require('./routes');
const db = require('./models');
const app = express();
// Set up Express components.
app.use(morgan('combined', { stream: logger.stream }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());
//enable cors
app.use(helmet());
app.use(cors());

// Serve the files statically from the 'public' folder.
app.use(express.static(path.join(__dirname, '../public')));

// Serve dynamic API routes with '/api/' path prefix.
app.use('/api', routes);

//db connect
db.sequelize.sync().then(() => {
  logger.info('sequelize db connected');
}).catch(err => {
  logger.error(err);
})
// Start the server.
app.listen(process.env.APP_PORT || 8080, () => {
  logger.info(`App listening on port ${process.env.APP_PORT || 8080}`);
});

// For test framework purposes...
module.exports = {
  app,
};