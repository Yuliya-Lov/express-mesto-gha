const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const {
  HTTP_STATUS_NOT_FOUND,
} = require('./utils/errors');

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '64b50415cd17fd9fc46aef86',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемая страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App Yul listening on port ${PORT}`);
});
