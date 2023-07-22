const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;

const errors = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'HTTP_STATUS_BAD_REQUEST') {
    res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
  } else if (err.name === 'DocumentNotFoundError' || err.name === 'HTTP_STATUS_NOT_FOUND' || err.name === 'JsonWebTokenError') {
    res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Указанный _id не найден' });
  } else {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }

  next();
};

module.exports = {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  errors,
};
