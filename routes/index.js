const router = require('express').Router();

const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/user');
const { createUserValidation, loginValidation } = require('../middlewares/validation');
const articleRouter = require('./articleRoutes').router;
const usersRouter = require('./userRoutes').router;
const notFoundRouter = require('./notFound').router;

router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);

router.use(auth, articleRouter, usersRouter, notFoundRouter);

module.exports = router;
