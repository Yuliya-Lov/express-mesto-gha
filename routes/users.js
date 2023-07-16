const userRouter = require('express').Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getAllUsers);

userRouter.get('/:id', getUser);

userRouter.post('/', createUser);

userRouter.patch('/me', updateUserInfo);

userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = { userRouter };
