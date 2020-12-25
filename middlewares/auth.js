const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

const { unauthorized } = require('../constants/requests');
const { jwtSecret } = require('../constants/forEnv');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    throw new UnauthorizedError(unauthorized);
  }
  const { authorization } = req.headers;
  if (!authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(unauthorized);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    const error = Error(unauthorized);
    error.statusCode = 401;
    next(error);
  }
  req.user = payload;
  next();
};
