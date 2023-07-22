const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const {
  HTTP_STATUS_NOT_FOUND,
} = require('../middlewares/errors');

const auth = (req, res, next) => {
  let token;
  try {
    console.log('1');
    token = req.cookies.jwt;
  } catch (err) {
    console.log('2');
    next(err);
    return;
  }
  console.log('3');
  let payload;
  try {
    console.log('4', token);
    console.log(jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'));
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    console.log(err);
    next(err);
    return;
    /*  JsonWebTokenError return Promise.reject(HTTP_STATUS_NOT_FOUND); */
    /*  return res
       .status(HTTP_STATUS_NOT_FOUND)
       .send({ message: 'Необходима авторизация' }); */
  }
  console.log('6');
  req.user = payload;
  res.send(req.user._id);
};

module.exports = {
  auth,
};
