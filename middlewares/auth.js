const jwt = require('jsonwebtoken');
const JWT_SECRET = 'e46a78f1f6ce4aef33f41595a5d06a518b2f802e0e611d84f9eb22f2c87fa60b';
const {
  HTTP_STATUS_UNAUTHORIZED,
} = require('../middlewares/errors');

const auth = (req, res, next) => {
  /* console.log(params);
  console.log(headers); */
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
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(HTTP_STATUS_UNAUTHORIZED);
  }
  console.log('6');
  req.user = payload;
  console.log({ id: req.user._id });
  next();
};

module.exports = {
  auth,
  JWT_SECRET,
};
