const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getAllCards);

cardRouter.post('/', createCard);

cardRouter.delete('/:id', deleteCard);

cardRouter.put('/:id/likes', likeCard);

cardRouter.delete('/:id/likes', dislikeCard);

module.exports = { cardRouter };
