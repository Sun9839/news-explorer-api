const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../constants/forEnv');
const User = require('../models/User');
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorizedError');
const { badData, badEmail, unauthorized } = require('../constants/requests');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || !password) {
    throw new BadRequestError(badData);
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((data) => {
          res.send({
            _id: data._id,
            email: data.email,
            name: data.name,
          });
        })
        .catch((err) => {
          let error;
          if (err.name === 'MongoError') {
            error = Error(badEmail);
            error.statusCode = 409;
            next(error);
          }
          if (err.name === 'ValidationError') {
            error = Error(badData);
            error.statusCode = 400;
            next(error);
          }
          next(err);
        });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!req.body.email || !req.body.password) {
    throw new BadRequestError(badData);
  }
  User.findUserByCredentials(email, password)
    .then((data) => {
      const token = jwt.sign({ _id: data._id }, jwtSecret, { expiresIn: '7d' });
      res.send({ _id: token });
    })
    .catch((err) => {
      let error;
      if (err.name === 'Error') {
        error = Error(badData);
        error.statusCode = 401;
        next(error);
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findOne({ _id: userId })
    .then((data) => {
      if (!data) {
        throw new UnauthorizedError(unauthorized);
      }
      res
        .send(data);
    })
    .catch(next);
};

module.exports = { createUser, login, getUser };
