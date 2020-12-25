const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const { badUrl } = require('../constants/requests');

const deleteArticleValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }).unknown(true),
});

const createArticleValidation = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value, helpers) => {
      if (isUrl(value)) {
        return value;
      }
      return helpers.message(badUrl);
    }),
    image: Joi.string().required().custom((value, helpers) => {
      if (isUrl(value)) {
        return value;
      }
      return helpers.message(badUrl);
    }),
  }).unknown(true),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  deleteArticleValidation, createArticleValidation, createUserValidation, loginValidation,
};
