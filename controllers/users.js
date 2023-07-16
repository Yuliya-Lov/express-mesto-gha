const User = require('../models/user');

class UserError extends Error {
  constructor(message) {
    super(message);
    this.message = {
      'message': message,
    };
  }

  getProperties() {
    if (this.message.message === 'Переданы некорректные данные') {
      this.name = 'UncorrectDataUserError';
      this.statusCode = 400;
      return;
    }
    if (this.message.message === 'Пользователь по указанному _id не найден') {
      this.name = 'UserNotFoundError';
      this.statusCode = 404;
      return;
    }
    this.message.message = 'Произошла ошибка запроса данных пользователя';
    this.name = 'DefaultUserError';
    this.statusCode = 500;
  }

  indicateErr() {
    console.log(`Ошибка: ${this.name}, код ошибки: ${this.statusCode}`);
  }
}

const userError = (message) => {
  const err = new UserError(message);
  err.getProperties();
  return err;
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      console.log(users);
      res.send({ data: users });
    })
    .catch((m = '') => {
      userError(m).indicateErr();
      res.status = userError(m).statusCode;
      res.send(userError(m).message);
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user
        ? res.send({ data: user })
        : Promise.reject('Пользователь по указанному _id не найден');
    })
    .catch((m = '') => {
      userError(m).indicateErr();
      res.status = userError(m).statusCode;
      res.send(userError(m).message);
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  name && about && avatar
    ? User.create({ name, about, avatar })
    : Promise.reject('Переданы некорректные данные')
      .then((user) => {
        res.send({ data: user });
      })
      .catch((m = '') => {
        userError(m).indicateErr();
        res.status = userError(m).statusCode;
        res.send(userError(m).message);
      });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  name && about
    ? User.findByIdAndUpdate(req.user._id, { name, about })
    : Promise.reject('Переданы некорректные данные')
      .then((user) => {
        user
          ? res.send({ data: user })
          : Promise.reject('Пользователь по указанному _id не найден');
      })
      .catch((m = '') => {
        userError(m).indicateErr();
        res.status = userError(m).statusCode;
        res.send(userError(m).message);
      });
};

const updateUserAvatar = (req, res) => {
  req.body.avatar
    ? User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    : Promise.reject('Переданы некорректные данные')
      .then((user) => {
        user
          ? res.send({ data: user })
          : Promise.reject('Пользователь по указанному _id не найден');
      })
      .catch((m = '') => {
        userError(m).indicateErr();
        res.status = userError(m).statusCode;
        res.send(userError(m).message);
      });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
