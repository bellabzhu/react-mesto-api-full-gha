const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Error400 = require('../errors/Error400');
const Error401 = require('../errors/Error401');
const Error404 = require('../errors/Error404');
const Error409 = require('../errors/Error409');
const { statusCode } = require('../utils/errors');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const mongoUpdateConfig = { new: true, runValidators: true };

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(statusCode.OK).send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      next(new Error404('Пользователь c таким id не найден.'));
      return;
    }
    const user = await User.findById(userId);
    res.status(statusCode.OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new Error400('Неверный формат данных.'));
    } else {
      next(err);
    }
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      next(new Error404('Пользователь c таким id не найден.'));
      return;
    }
    res.status(statusCode.OK).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(statusCode.OK).send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new Error400('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new Error409('Пользователь с таким email уже зарегистрирован.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new Error401('Неправильная почта или пароль'));
      return;
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      next(new Error401('Неправильная почта или пароль'));
      return;
    }
    const token = await jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'you-shall-not-pass-hooman',
      { expiresIn: '7d' },
    );
    res.status(statusCode.OK)
      .cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
      .send({ message: 'Авторизация успешна. Токен сохранен в куки' });
  } catch (err) {
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      mongoUpdateConfig,
    );
    res.status(statusCode.OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new Error400('Переданы некорректные данные.'));
    } else {
      next(err);
    }
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      mongoUpdateConfig,
    );
    res.status(statusCode.OK).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new Error400('Переданы некорректные данные.'));
    } else {
      next(err);
    }
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    res.status(statusCode.OK)
      .cookie('token', '', {
        maxAge: 0,
        httpOnly: true,
      })
      .send({ message: 'Вы успешно разлогинились!' });
  } catch (err) {
    next(err);
  }
};
