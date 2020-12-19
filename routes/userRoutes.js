const userRouter = require('express').Router();
const { getUser } = require('../controllers/user');

userRouter.get('/users/me', (req, res, next) => {
  getUser(req, res, next);
});

module.exports = {
  router: userRouter,
};
