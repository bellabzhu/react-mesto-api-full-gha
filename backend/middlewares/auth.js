const jwt = require('jsonwebtoken');
const Error401 = require('../errors/Error401');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) { 
    next(new Error401('Необходима авторизация.'));
  };
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'you-shall-not-pass-hooman');
    req.user = payload;
    next();
  } catch (err) {
    next(new Error401('Необходима авторизация.'));
  }
};

module.exports = { auth };
