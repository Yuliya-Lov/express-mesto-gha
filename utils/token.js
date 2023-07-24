const jwt = require('jsonwebtoken');

const JWT_SECRET = 'e46a78f1f6ce4aef33f41595a5d06a518b2f802e0e611d84f9eb22f2c87fa60b';

const createToken = (payload) => jwt.sign(payload, JWT_SECRET);

const checkToken = (token) => {
  if (!token) {
    return false;
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return false;
  }
};

module.exports = {
  createToken,
  checkToken,
};
