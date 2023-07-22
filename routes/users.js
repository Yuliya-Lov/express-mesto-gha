const userRouter = require('express').Router();
const {
  getAllUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');
const {auth} = require('../middlewares/auth');

userRouter.get('/', getAllUsers);

userRouter.get('/me', auth);

userRouter.patch('/me', updateUserInfo);

userRouter.get('/:id', getUser);

userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = { userRouter };
