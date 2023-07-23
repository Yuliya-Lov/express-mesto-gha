const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');
const urlPattern = /^https?:\/\/(www.)?[a-zA-Z0-9\-\.~:\/\?#\[\]@!\$&'\()\*\+,;=]/;

userRouter.get('/', getAllUsers);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlPattern),
  }).unknown(true),
}), updateUserInfo);

userRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlPattern),
  }).unknown(true),
}), updateUserAvatar);

module.exports = { userRouter };
