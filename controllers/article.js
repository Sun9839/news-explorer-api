const Article = require('../models/Article');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const UnauthorizedError = require('../errors/unauthorizedError');

const getArticles = (req, res, next) => {
  const own = req.user;
  Article.find({ owner: own })
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, source, link, image,
  } = req.body;
  const owner = req.user;
  if (!req.body || !keyword || !title || !text || !source || !link || !image) {
    throw new BadRequestError('Неправильно введены данные');
  }
  Article.create({
    keyword, title, text, source, link, image, owner,
  })
    .then((art) => {
      res.send(art);
    })
    .catch((err) => {
      let error;
      if (err.name === 'ValidationError') {
        error = Error('Неправильно введены данные');
        error.statusCode = 400;
        next(error);
      } else if (err.name === 'MongoError') {
        error = Error('Статья с таким названием уже существует');
        error.statusCode = 409;
        next(error);
      }
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  Article.findById(id).select('+owner')
    .then((data) => {
      if (!data) {
        throw new BadRequestError('Такой статьи нет');
      }
      if (data.owner !== userId) {
        throw new UnauthorizedError('Эта статья у вас не сохранена');
      }
      Article.findByIdAndRemove(id)
        .then((deletedArticle) => {
          res.send(deletedArticle);
        });
    })
    .catch((err) => {
      let error;
      if (err.name === 'CastError') {
        error = Error('Неправильный id статьи');
        error.statusCode = 400;
        next(error);
      }
      next(err);
    });
};

module.exports = {
  createArticle, getArticles, deleteArticle,
};
