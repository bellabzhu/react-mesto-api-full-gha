require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
const { limiter } = require('./middlewares/limiter');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, logout, createUser } = require('./controllers/users');
const Error404 = require('./errors/Error404');
const { auth } = require('./middlewares/auth');
const { REGEX_URL } = require('./utils/constants');
const { handleErrors } = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
mongoose.set('strictQuery', true);

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'http://mestobella.nomoredomains.work',
    'https://mestobella.nomoredomains.work',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
};

app.use('*', cors(options));

// app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(limiter);

async function start() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
    });
    /* eslint-disable no-alert, no-console */
    app.listen(PORT, () => {
      console.log('Серверочек-то запущен!');
    });
  } catch (e) {
    console.log(e);
  }
}

start();

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REGEX_URL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.delete('/logout', logout);
app.use('/*', (req, res, next) => {
  next(new Error404('Страница не найдена'));
});

app.use(errorLogger);
app.use(errors());
app.use(handleErrors);
