const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const indexRouter = require('./routes/index');
const sendError = require('./middlewares/sendError');
const { mongoPath } = require('./constants/forEnv');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

mongoose.connect(mongoPath, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then();

app.use(requestLogger);
app.use(indexRouter);
app.use(errorLogger);
app.use(errors());
app.use(sendError);
app.use(limiter);

app.listen(PORT, () => {
});
