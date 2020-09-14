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
const routes = require('./routes/index.routes');
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
app.get("/", (req, res) => res.send("WELCOME TO API HOME."));
app.use('/api/v1', require('./routes/index.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.use(function(req, res, next) {
  res.status(404).send({message: 'ROUTE NOT FOUND.'});
});

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

function print (path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split (thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}

app._router.stack.forEach(print.bind(null, []))

// For test framework purposes...
module.exports = {
  app,
};
