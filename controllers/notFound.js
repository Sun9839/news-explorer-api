const NotFoundError = require('../errors/notFoundError');

const notFound = (req, res, next) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
};

module.exports = {
  notFound,
};
