const Card = require('../models/card');

class CardError extends Error {
  constructor(message) {
    super(message);
    this.message = {
      'message': message,
    };
  }

  getProperties() {
    if (this.message.message === 'Переданы некорректные данные') {
      this.name = 'UncorrectDataCardError';
      this.statusCode = 400;
      return;
    }
    if (this.message.message === 'Карточка с указанным _id не найдена') {
      this.name = 'CardNotFoundError';
      this.statusCode = 404;
      return;
    }
    this.message.message = 'Произошла ошибка запроса данных карточки';
    this.name = 'DefaultCardError';
    this.statusCode = 500;
  }

  indicateErr() {
    console.log(`Ошибка: ${this.name}, код ошибки: ${this.statusCode}`);
  }
}

const cardError = (message) => {
  const err = new CardError(message);
  err.getProperties();
  return err;
};

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((m = '') => {
      cardError(m).indicateErr();
      res.status = cardError(m).statusCode;
      res.send(cardError(m).message);
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  name && link
    ? Card.create({ name, link })
    : Promise.reject('Переданы некорректные данные')
      .then((card) => {
        console.log(card);
        res.send({ data: card });
      })
      .catch((m = '') => {
        cardError(m).indicateErr();
        res.status = cardError(m).statusCode;
        res.send(cardError(m).message);
      });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        return Promise.reject('Карточка с указанным _id не найдена');
      }
      res.send({ data: card });
    })
    .catch((m = '') => {
      cardError(m).indicateErr();
      res.status = cardError(m).statusCode;
      res.send(cardError(m).message);
    });
};

const likeCard = (req, res) => {
  req.user._id
    ? Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    : Promise.reject('Переданы некорректные данные')
      .then((card) => {
        card
          ? res.send({ data: card })
          : Promise.reject('Карточка с указанным _id не найдена');
      })
      .catch((m = '') => {
        cardError(m).indicateErr();
        res.status = cardError(m).statusCode;
        res.send(cardError(m).message);
      });
};

const dislikeCard = (req, res) => {
  req.user._id
    ? Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    : Promise.reject('Переданы некорректные данные')
      .then((card) => {
        card
          ? res.send({ data: card })
          : Promise.reject('Карточка с указанным _id не найдена');
      })
      .catch((m = '') => {
        cardError(m).indicateErr();
        res.status = cardError(m).statusCode;
        res.send(cardError(m).message);
      });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
