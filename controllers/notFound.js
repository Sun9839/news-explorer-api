const NotFoundError = require('../errors/notFoundError');
const { notFoundText } = require('../constants/requests');

const notFound = () => {
  throw new NotFoundError(notFoundText);
};

module.exports = {
  notFound,
};
