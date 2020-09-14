const jwt = require("jsonwebtoken");
const db = require('../models');

verifyToken = (req, res, next) => {
  let token = req.headers["Authorization"];
  if (!token) {
    req.userId = null;
    return next();
  }
  token = token.replace('Bearer ', ''); 
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.userId = null;
      return next();
    }
    req.userId = decoded.id;
    next();
  });
}

isAdmin = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).send({
      message: "Unauthorized!"
    });
  }
  db.Users.findOne({ where : {id: req.userId, role: 'ADMIN'} }).then(user => {
    if (!user) {
      res.status(401).send({
        message: "Invalid Credentials"
      });
    }
    req.user = user;
    next();
  });
};

isUser = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).send({
      message: "Unauthorized!"
    });
  }
  db.Users.findOne({ where : {id: req.userId, role: 'USER'} }).then(user => {
    if (!user) {
      return res.status(401).send({
        message: "Invalid Credentials"
      });
    }
    req.user = user;
    next();
  });
};

isLoggedIn = (req, res, next) => { 
  if (!req.userId) {
    return res.status(401).send({
      message: "Unauthorized!"
    });
  }
  next();
}

createToken = (id) => {
  if (!id) {
    return null;
  }
  return jwt.sign({ id: id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY});
}

module.exports = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isUser: isUser,
  isLoggedIn: isLoggedIn,
  createToken: createToken
}