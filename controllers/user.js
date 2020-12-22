const bcrypt = require('bcrypt');

const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorizedError');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || !password) {
    throw new BadRequestError('Некорректные данные');
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
            error = Error('email уже используется');
            error.statusCode = 409;
            next(error);
          }
          if (err.name === 'ValidationError') {
            error = Error('Неправильные данные');
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
    throw new BadRequestError('Некорректные данные');
  }
  User.findUserByCredentials(email, password)
    .then((data) => {
      const token = jwt.sign({ _id: data._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ _id: token });
    })
    .catch((err) => {
      let error;
      if (err.name === 'Error') {
        error = Error('Неправильная почта или пароль');
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
        throw new UnauthorizedError('Необходима авторизация');
      }
      res
        .send(data);
    })
    .catch(next);
};

module.exports = { createUser, login, getUser };
