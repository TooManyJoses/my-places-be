const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(500, 'Server Error');
    return next(error);
  }
  res.status(200).json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;

  let sendUser;
  try {
    sendUser = await User.findById(userId, '-password');
  } catch (err) {
    const error = new HttpError(500, 'Server Error');
    return next(error);
  }

  if (!sendUser) {
    const err = HttpError(404, 'No user with provided id exists');
    return next(err);
  }

  // delete sendUser.password;
  console.log('sendUsersendUsersendUsersendUsersendUsersendUsersendUsersendUsersendUsersendUser', sendUser)
  res.status(200).json({ user: sendUser.toObject({ getters: true })});
};

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = HttpError(422, 'Invalid Inputs Passed.');
    return next(err);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(500, 'Signing up failed.');
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(422, 'User exists already.');
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    password,
    image: 'https://avatars.githubusercontent.com/u/80218937?v=4',
    places: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(500, 'Sign up failed. Please try again');
    return next(error);
  }
  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let userToLogin;
  try {
    userToLogin = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(500, 'Logging up failed.');
    return next(error);
  }

  if (!userToLogin || userToLogin.password !== password) {
    const error = new HttpError(401, 'Invalid credentials. Could not log in.');
    return next(error);
  }

  res.status(200).json({ message: 'logged in' });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.loginUser = loginUser;
