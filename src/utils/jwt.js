const jwt = require('jsonwebtoken');
const db = require('../models');
const logger = require('./logger');

exports.verifyToken = (req, res, next) => {
  let token = req.headers.Authorization;
  if (!token) {
    req.userId = null;
    return next();
  }
  token = token.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
  } catch (err) {
    req.userId = null;
  }
  return next();
};

exports.isAdmin = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).send({ message: 'Unauthorized!' });
  }
  try {
    const user = await db.Users.findOne({ where: { id: req.userId, role: 'ADMIN' } });
    if (!user) {
      return res.status(401).send({ message: 'Invalid Credentials' });
    }
    req.user = user;
    return next();
  } catch (err) {
    logger.error('unable to check admin', err);
  }
  return res.status(500).send({ message: 'unable to check admin' });
};

exports.isUser = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).send({
      message: 'Unauthorized!',
    });
  }
  try {
    const user = await db.Users.findOne({ where: { id: req.userId, role: 'USER' } });
    if (!user) {
      return res.status(401).send({ message: 'Invalid Credentials' });
    }
    req.user = user;
    return next();
  } catch (err) {
    logger.error('unable to check admin', err);
  }
  return res.status(500).send({ message: 'unable to check admin' });
};

exports.isLoggedIn = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).send({
      message: 'Unauthorized!',
    });
  }
  return next();
};

exports.createToken = (id) => {
  if (!id) {
    return null;
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
};
