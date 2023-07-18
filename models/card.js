const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return (v.length >= 2 && v.length <= 30);
      },
      message: 'Введите название от 2 до 30 символов!',
    },
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return (v.length >= 2 && v.length <= 30);
      },
      message: 'Введите url-адрес от 2 до 30 символов!',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
