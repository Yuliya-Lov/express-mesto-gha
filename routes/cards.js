const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// eslint-disable-next-line
const urlPattern = /^https?:\/\/(www.)?[a-zA-Z0-9\-\.~:\/\?#\[\]@!\$&'\()\*\+,;=]{2,}\.[a-zA-Z]{2,}/;

cardRouter.get('/', getAllCards);

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(urlPattern).required(),
    owner: Joi.string().hex().length(24),
  }).unknown(true),
}), createCard);

cardRouter.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);

cardRouter.put('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

cardRouter.delete('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = { cardRouter };
