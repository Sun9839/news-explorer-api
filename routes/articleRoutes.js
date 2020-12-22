const articleRouter = require('express').Router();
const { getArticles, createArticle, deleteArticle } = require('../controllers/article');
const { deleteArticleValidation, createArticleValidation } = require('../middlewares/validation');

articleRouter.delete('/articles/:id', deleteArticleValidation, deleteArticle);

articleRouter.get('/articles', getArticles);

articleRouter.post('/articles', createArticleValidation, createArticle);

module.exports = {
  router: articleRouter,
};
