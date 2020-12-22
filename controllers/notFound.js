const NotFoundError = require('../errors/notFoundError');

const notFound = () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
};

module.exports = {
  notFound,
};
