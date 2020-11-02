"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var jwt = require('jsonwebtoken');

var db = require('../models');

var logger = require('./logger');

exports.verifyToken = function (req, res, next) {
  var token = req.headers.Authorization;

  if (!token) {
    req.userId = null;
    return next();
  }

  token = token.replace('Bearer ', '');

  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
  } catch (err) {
    req.userId = null;
  }

  return next();
};

exports.isAdmin = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.userId) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", res.status(401).send({
              message: 'Unauthorized!'
            }));

          case 2:
            _context.prev = 2;
            _context.next = 5;
            return db.Users.findOne({
              where: {
                id: req.userId,
                role: 'ADMIN'
              }
            });

          case 5:
            user = _context.sent;

            if (user) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", res.status(401).send({
              message: 'Invalid Credentials'
            }));

          case 8:
            req.user = user;
            return _context.abrupt("return", next());

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](2);
            logger.error('unable to check admin', _context.t0);

          case 15:
            return _context.abrupt("return", res.status(500).send({
              message: 'unable to check admin'
            }));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 12]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.isUser = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var user;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (req.userId) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", res.status(401).send({
              message: 'Unauthorized!'
            }));

          case 2:
            _context2.prev = 2;
            _context2.next = 5;
            return db.Users.findOne({
              where: {
                id: req.userId,
                role: 'USER'
              }
            });

          case 5:
            user = _context2.sent;

            if (user) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt("return", res.status(401).send({
              message: 'Invalid Credentials'
            }));

          case 8:
            req.user = user;
            return _context2.abrupt("return", next());

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](2);
            logger.error('unable to check admin', _context2.t0);

          case 15:
            return _context2.abrupt("return", res.status(500).send({
              message: 'unable to check admin'
            }));

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 12]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.isLoggedIn = function (req, res, next) {
  if (!req.userId) {
    return res.status(401).send({
      message: 'Unauthorized!'
    });
  }

  return next();
};

exports.createToken = function (id) {
  if (!id) {
    return null;
  }

  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY
  });
};