const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const { authorization } = req.headers;
  if (!authorization.startsWith('Bearer ')) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
