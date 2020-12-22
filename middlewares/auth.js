const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const { authorization } = req.headers;
  if (!authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    const error = Error('Необходима авторизация');
    error.statusCode = 401;
    next(error);
  }
  req.user = payload;
  next();
};
