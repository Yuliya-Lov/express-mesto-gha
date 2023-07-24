/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_USER_STATUS_NOT_FOUND,
} = require('../utils/errors');
const {
  createToken,
} = require('../utils/token');

const getAllUsers = (req, res, next) => {
  User.find({})
    .orFail(HTTP_STATUS_BAD_REQUEST)
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => next(err));
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(HTTP_USER_STATUS_NOT_FOUND)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create(
        {
          email: req.body.email,
          password: hash,
          name: req.body.name,
          about: req.body.about,
          avatar: req.body.avatar,
        },
      )
        .then((user) => res
          .status(201)
          .send({
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const authMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = createToken({ _id: user._id });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        }).send({
          data: token,
        });
    })
    .catch((err) => next(err));
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  }).orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

const updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  ).orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  authMe,
  login,
};
