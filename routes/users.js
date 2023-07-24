const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {auth} = require('../middlewares/auth')
const {
  getAllUsers,
  getUser,
  authMe,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');
const urlPattern = /^https?:\/\/(www.)?[a-zA-Z0-9\-\.~:\/\?#\[\]@!\$&'\()\*\+,;=]{2,}\.[a-zA-Z]{2,}/;

userRouter.get('/', auth, getAllUsers);

userRouter.get('/me',  celebrate({
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string(),
    }),
  }),
}), authMe);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateUserInfo);

userRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlPattern).required(),
  }).unknown(true),
}), updateUserAvatar);

module.exports = { userRouter };
