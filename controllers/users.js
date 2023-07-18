const mongoose = require('mongoose');
const User = require('../models/user');

const UserNotFoundError = new Error('Пользователь с указанным _id не найден');
UserNotFoundError.name = 'UserNotFoundError';

const UncorrectDataUserError = new Error('Переданы некорректные данные');
UncorrectDataUserError.name = 'UncorrectDataUserError';

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка запроса данных пользователя' });
    });
};

const getUser = (req, res) => {
  (mongoose.Types.ObjectId.isValid(req.params.id)
    ? User.findById(req.params.id)
    : Promise.reject(UncorrectDataUserError))
    .then((user) => {
      user
        ? res.send({ data: user })
        : res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'UncorrectDataUserError') {
        res.status(400).send({ message: `${err.message}` });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка запроса данных пользователя' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  (name && about && avatar
    ? User.create({ name, about, avatar })
    : Promise.reject(UncorrectDataUserError))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError' || err.name === 'UncorrectDataUserError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка запроса данных пользователя' });
      }
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    upsert: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' })
      }
      else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      else {
        res.status(500).send({ message: 'Произошла ошибка запроса данных пользователя' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  (req.body.avatar
    ? User.findByIdAndUpdate(req.user._id,
      { avatar: req.body.avatar },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    )
    : Promise.reject(UncorrectDataUserError))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'UncorrectDataUserError') {
        res.status(400).send({ message: `${err.message}` });
      } else {
        res.status(500).send({ message: 'Произошла ошибка запроса данных пользователя' });
      }
    });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
