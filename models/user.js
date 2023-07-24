const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  HTTP_STATUS_UNAUTHORIZED,
} = require('../utils/errors');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function ({ email, password }) {
  return this.findOne({ email })
    .orFail(HTTP_STATUS_UNAUTHORIZED)
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(HTTP_STATUS_UNAUTHORIZED);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(HTTP_STATUS_UNAUTHORIZED);
          }
          return user;
        })
        .catch((err) => Promise.reject(err));
    })
    .catch((err) => Promise.reject(err));
};

module.exports = mongoose.model('user', userSchema);
