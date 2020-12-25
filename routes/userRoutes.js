const userRouter = require('express').Router();
const { getUser } = require('../controllers/user');

userRouter.get('/users/me', getUser);

module.exports = {
  router: userRouter,
};
