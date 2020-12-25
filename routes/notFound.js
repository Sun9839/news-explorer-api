const notFoundRouter = require('express').Router();
const { notFound } = require('../controllers/notFound');

notFoundRouter.all('/:id/:id', notFound);

notFoundRouter.all('/:id', notFound);

notFoundRouter.all('/', notFound);

module.exports = {
  router: notFoundRouter,
};
