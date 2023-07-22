const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');
const { createUser, login } = require('./controllers/users');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const {
  HTTP_STATUS_NOT_FOUND,
  errors,
} = require('./middlewares/errors');

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64b50415cd17fd9fc46aef86',
  };

  next();
});
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', () => Promise.reject(HTTP_STATUS_NOT_FOUND));
app.use(errors);

app.listen(PORT, () => {
  console.log(`App Yul listening on port ${PORT}`);
});
