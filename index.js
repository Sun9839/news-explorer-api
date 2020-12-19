const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const articleRouter = require('./routes/articleRoutes').router;
const usersRouter = require('./routes/userRoutes').router;
const notFoundRouter = require('./routes/notFound').router;

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/newsexplorerdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then();

app.use(requestLogger);
app.post('/signup', (req, res, next) => {
  createUser(req, res, next);
});
app.post('/signin', (req, res, next) => {
  login(req, res, next);
});
app.use(auth);
app.use(articleRouter, usersRouter, notFoundRouter);
app.use(errorLogger);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

app.listen(PORT, () => {
});
