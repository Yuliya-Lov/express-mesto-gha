const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return (v.length >= 2 && v.length <= 30);
      },
      message: 'Введите имя от 2 до 30 символов!',
    },
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return (v.length >= 2 && v.length <= 30);
      },
      message: 'Введите описание от 2 до 30 символов!',
    },
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
