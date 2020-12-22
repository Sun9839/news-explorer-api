const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const indexRouter = require('./routes/index');
const sendError = require('./middlewares/sendError');

const { PORT = 3000, MONGO_PATH } = process.env;

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(limiter);

mongoose.connect(MONGO_PATH, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then();

app.use(requestLogger);
app.use(indexRouter);
app.use(errorLogger);
app.use(errors());
app.use(sendError);

app.listen(PORT, () => {
});
