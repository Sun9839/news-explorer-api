const mongoose = require('mongoose');

const regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

const articleSchema = mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    unique: true,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regex.test(v);
      },
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regex.test(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('Article', articleSchema);
