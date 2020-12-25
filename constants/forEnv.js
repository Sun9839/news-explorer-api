const { NODE_ENV, MONGO_PATH, JWT_SECRET } = process.env;

const mongoPath = NODE_ENV === 'production' ? MONGO_PATH : 'mongodb://localhost:27017/newsexplorerdb';
const jwtSecret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

module.exports = {
  mongoPath, jwtSecret,
};
