const mongoose = require('mongoose');
const Card = require('../models/card');

const CardNotFoundError = new Error('Карточка  с указанным _id не найдена');
CardNotFoundError.name = 'CardNotFoundError';

const UncorrectDataCardError = new Error('Переданы некорректные данные');
UncorrectDataCardError.name = 'UncorrectDataCardError';

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'UncorrectDataCardError') {
        res.status(400).send({ message: `${err.message}` });
      } else if (err.name === 'CastError' || err.name === 'CardNotFoundError') {
        res.status(404).send({ message: 'Карточка  с указанным _id не найдена' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка запроса данных карточки' });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  (name && link
    ? Card.create({ name, link })
    : res.status(400).send({ message: UncorrectDataCardError.message }))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'UncorrectDataCardError') {
        res.status(400).send({ message: `${err.message}` });
      } else {
        res.status(500).send({ message: 'Произошла ошибка запроса данных карточки' });
      }
    })
};

const deleteCard = (req, res) => {
  (mongoose.Types.ObjectId.isValid(req.params.id)
    ? Card.findByIdAndRemove(req.params.id)
    : Promise.reject(UncorrectDataCardError))
    .then((card) => {
      card
        ? res.send({ data: card })
        : res.status(404).send({ message: 'Карточка  с указанным _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'UncorrectDataCardError') {
        res.status(400).send({ message: `${err.message}` });
      } else if (err.name === 'CastError' || err.name === 'CardNotFoundError') {
        res.status(404).send({ message: 'Карточка  с указанным _id не найдена' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка запроса данных карточки' });
      }
    });
};

const likeCard = (req, res) => {
  (mongoose.Types.ObjectId.isValid(req.params.id)
    ? Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    : Promise.reject(UncorrectDataCardError))
    .then((card) => {
      card
        ? res.send({ data: card })
        : res.status(404).send({ message: 'Карточка  с указанным _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'UncorrectDataCardError') {
        res.status(400).send({ message: `${err.message}` });
      } else if (err.name === 'CastError' || err.name === 'CardNotFoundError') {
        res.status(404).send({ message: 'Карточка  с указанным _id не найдена' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка запроса данных карточки' });
      }
    });
};

const dislikeCard = (req, res) => {
  (mongoose.Types.ObjectId.isValid(req.params.id)
    ? Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true })
    : Promise.reject(UncorrectDataCardError))
    .then((card) => {
      card
        ? res.send({ data: card })
        : res.status(404).send({ message: 'Карточка  с указанным _id не найдена' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'UncorrectDataCardError') {
        res.status(400).send({ message: `${err.message}` });
      } else if (err.name === 'CastError' || err.name === 'CardNotFoundError') {
        res.status(404).send({ message: 'Карточка  с указанным _id не найдена' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка запроса данных карточки' });
      }
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
