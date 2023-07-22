const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
} = require('../middlewares/errors');

const getAllUsers = (req, res, next) => {
  User.find({})
    .orFail(HTTP_STATUS_BAD_REQUEST)
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => next(err));
  /* .catch(() => {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }); */
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => next(err));
  /*    .catch((err) => {
       if (err.name === 'CastError') {
         res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
       } else if (err.name === 'DocumentNotFoundError') {
         res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
       } else {
         res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
       }
     }); */
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
        .then((user) => res.send({ data: user }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
  /*     .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
        } else {
          res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
        }
      }); */
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      if (!user) {
        return Promise.reject(HTTP_STATUS_NOT_FOUND);
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => next(err));
  /*   .catch(() => {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Неправильные почта или пароль' });
    }); */
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  }).orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
  /*     .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
        } else if (err.name === 'DocumentNotFoundError') {
          res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
        } else {
          res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
        }
      }); */
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
  /*    .catch((err) => {
       if (err.name === 'DocumentNotFoundError') {
         res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
       } else {
         res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
       }
     }); */
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
};
