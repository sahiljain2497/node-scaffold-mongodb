"use strict";

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _path = _interopRequireDefault(require("path"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cors = _interopRequireDefault(require("cors"));

var _logger = _interopRequireDefault(require("./utils/logger"));

var _index = _interopRequireDefault(require("./routes/index.routes"));

var _admin = _interopRequireDefault(require("./routes/admin.routes"));

var _models = _interopRequireDefault(require("./models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require('dotenv').config();

var app = (0, _express["default"])(); // Set up Express components.

app.use((0, _morgan["default"])('combined', {
  stream: _logger["default"].stream
})); // parse requests of content-type - application/x-www-form-urlencoded

app.use(_bodyParser["default"].urlencoded({
  extended: true
})); // parse requests of content-type - application/json

app.use(_bodyParser["default"].json()); // enable cors

app.use((0, _helmet["default"])());
app.options('*', (0, _cors["default"])()); // Serve the files statically from the 'public' folder.

app.use(_express["default"]["static"](_path["default"].join(__dirname, '../public'))); // Serve dynamic API routes with '/api/' path prefix.

app.get('/', function (req, res) {
  return res.send('WELCOME TO API HOME.');
});
app.use('/api/v1', _index["default"]);
app.use('/api/v1/admin', _admin["default"]);
app.use(function (req, res) {
  return res.status(404).send('ROUTE NOT FOUND.');
}); // db connect

_models["default"].sequelize.authenticate().then(function () {
  _logger["default"].info('sequelize db connected');
})["catch"](function (err) {
  _logger["default"].error(err);
});

if (process.env.NODE_ENV == 'development') {
  var routeprinter = require('../src/utils/routeprinter');

  routeprinter.init(app);
} // Start the server.


app.listen(process.env.APP_PORT || 8080, function () {
  _logger["default"].info("App listening on port ".concat(process.env.APP_PORT || 8080));
});