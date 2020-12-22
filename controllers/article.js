const Article = require('../models/Article');
const BadRequestError = require('../errors/badRequestError');

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
      res.send({
        _id: art._id,
        keyword: art.keyword,
        title: art.title,
        text: art.text,
        source: art.source,
        link: art.link,
        image: art.image,
        date: art.date,
      });
    })
    .catch((err) => {
      let error;
      if (err.name === 'ValidationError') {
        error = Error('Неправильно введены данные');
        error.statusCode = 400;
        next(error);
      }
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { id } = req.params;
  Article.findById(id).select('+owner')
    .then((data) => {
      if (!data) {
        throw new BadRequestError('Такой статьи нет');
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
