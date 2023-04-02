const jwt = require('jsonwebtoken');
const Error401 = require('../errors/Error401');

const auth = async (req, res, next) => {
  const { token } = req.cookies;
  let payload;
  try {
    console.log(token, 'token in auth backend');
    payload = jwt.verify(token, 'dev-secret');
    console.log(payload, 'payload');
    req.user = payload;
    next();
  } catch (err) {
    next(new Error401('Необходима авторизация.'));
  }
};

module.exports = { auth };
