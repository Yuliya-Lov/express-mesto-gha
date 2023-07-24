/* eslint-disable consistent-return */
const Card = require('../models/card');
const {
  HTTP_STATUS_FORBIDDEN,
  HTTP_CARD_STATUS_NOT_FOUND,
} = require('../utils/errors');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res
      .status(201)
      .send({ data: card }))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(HTTP_CARD_STATUS_NOT_FOUND)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return next(HTTP_STATUS_FORBIDDEN);
      }
      Card.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).send({
          message: 'Карточка удалена',
        }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(HTTP_CARD_STATUS_NOT_FOUND)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => next(err));
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(HTTP_CARD_STATUS_NOT_FOUND)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => next(err));
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
