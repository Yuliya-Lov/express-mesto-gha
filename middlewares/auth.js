const jwt = require('jsonwebtoken');
const {
  HTTP_STATUS_UNAUTHORIZED,
} = require('../middlewares/errors');
const {
  checkToken
} =  require('../utils/token');

const auth = (req, res, next) => {
  if(!req.cookies.jwt){
    return next(HTTP_STATUS_UNAUTHORIZED);
  }
  if(!checkToken(req.cookies.jwt)) {
    return next(HTTP_STATUS_UNAUTHORIZED);
  }
  const payload = checkToken(req.cookies.jwt);
  console.log("авторизация пройдена!", payload);
  req.user = payload;
  next();
};

module.exports = {
  auth
};
