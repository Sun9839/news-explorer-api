const articleRouter = require('express').Router();
const { getArticles, createArticle, deleteArticle } = require('../controllers/article');

articleRouter.delete('/articles/:id', (req, res, next) => {
  deleteArticle(req, res, next);
});

articleRouter.get('/articles', (req, res, next) => {
  getArticles(req, res, next);
});

articleRouter.post('/articles', (req, res, next) => {
  createArticle(req, res, next);
});

module.exports = {
  router: articleRouter,
};
