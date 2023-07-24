const HTTP_STATUS_BAD_REQUEST = {
  name: 'HTTP_STATUS_BAD_REQUEST',
  code: 400,
  message: 'Переданы некорректные данные',
};
const HTTP_USER_STATUS_NOT_FOUND = {
  name: 'HTTP_USER_STATUS_NOT_FOUND',
  code: 404,
  message: 'Пользователь не найден',
};

const HTTP_CARD_STATUS_NOT_FOUND = {
  name: 'HTTP_CARD_STATUS_NOT_FOUND',
  code: 404,
  message: 'Карточка не найдена',
};
const HTTP_PAGE_STATUS_NOT_FOUND = {
  name: 'HTTP_CARD_STATUS_NOT_FOUND',
  code: 404,
  message: 'Страница не найдена',
};
const HTTP_STATUS_UNAUTHORIZED = {
  name: 'HTTP_STATUS_UNAUTHORIZED',
  code: 401,
  message: 'Неуспешная авторизация',
};

const HTTP_STATUS_FORBIDDEN = {
  name: 'HTTP_STATUS_FORBIDDEN',
  code: 403,
  message: 'Доступ запрещен',
};
const HTTP_STATUS_CONFLICT = {
  name: 'HTTP_STATUS_CONFLICT',
  code: 409,
  message: 'Пользователь с таким email уже зарегистрирован',
};
const HTTP_STATUS_INTERNAL_SERVER_ERROR = {
  name: 'HTTP_STATUS_INTERNAL_SERVER_ERROR',
  code: 500,
  message: 'На сервере произошла ошибка',
};

const customErrors = (err, req, res, next) => {
  if (err.name === 'ValidationError'
    || err.name === 'CastError'
    || err.name === 'HTTP_STATUS_BAD_REQUEST') {
    res
      .status(HTTP_STATUS_BAD_REQUEST.code)
      .send({ message: HTTP_STATUS_BAD_REQUEST.message });
  } else if (err.name === 'DocumentNotFoundError'
    || err.name === 'HTTP_USER_STATUS_NOT_FOUND'
    || err.name === 'HTTP_CARD_STATUS_NOT_FOUND'
    || err.name === 'HTTP_PAGE_STATUS_NOT_FOUND') {
    res
      .status(err.code)
      .send({ message: err.message });
  } else if (err.name === 'HTTP_STATUS_FORBIDDEN') {
    res
      .status(HTTP_STATUS_FORBIDDEN.code)
      .send({ message: err.message });
  } else if (err.name === 'HTTP_STATUS_UNAUTHORIZED'
    || err.name === 'JsonWebTokenError') {
    res.status(HTTP_STATUS_UNAUTHORIZED.code).send({ message: HTTP_STATUS_UNAUTHORIZED.message });
  } else if (err.name === 'MongoServerError') {
    res
      .status(HTTP_STATUS_CONFLICT.code)
      .send({ message: HTTP_STATUS_CONFLICT.message });
  } else {
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR.code)
      .send({ message: HTTP_STATUS_INTERNAL_SERVER_ERROR.message });
  }

  next();
};

module.exports = {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_USER_STATUS_NOT_FOUND,
  HTTP_CARD_STATUS_NOT_FOUND,
  HTTP_PAGE_STATUS_NOT_FOUND,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_CONFLICT,
  customErrors,
};
