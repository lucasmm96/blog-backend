const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jToken = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created', userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  return
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('Email could not be found');
      error.statusCode = 401;
      throw error;
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      const error = new Error('Wrong passoword');
      error.statusCode = 401;
      throw error;
    }
    const token = jToken.sign({
      email: user.email,
      userId: user._id.toString()
    }, process.env.LOGIN_TOKEN, { expiresIn: '1h' });
    res.status(200).json({ token: token, userId: user._id.toString() });
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      error = new Error('User not found');
      error.statusCode = 401
      throw error;
    }
    res.status(200).json({ message: 'User status fetched', status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateStatus = async (req, res) => {
  const status = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      error = new Error('User not found');
      error.statusCode = 401
      throw error;
    }
    user.status = status;
    const result = await user.save();
    res.status(200).json({ message: 'User status updated', status: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
