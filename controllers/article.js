const Article = require('../models/Article');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');
const { badData, notYourArticle, badId } = require('../constants/requests');

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
    throw new BadRequestError(badData);
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
        error = Error(badData);
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
        throw new ForbiddenError(notYourArticle);
      }
      Article.findByIdAndRemove(id)
        .then((deletedArticle) => {
          res.send(deletedArticle);
        });
    })
    .catch((err) => {
      let error;
      if (err.name === 'CastError') {
        error = Error(badId);
        error.statusCode = 400;
        next(error);
      }
      next(err);
    });
};

module.exports = {
  createArticle, getArticles, deleteArticle,
};
