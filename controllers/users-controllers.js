let MOCKUSERS = [
  {
    id: 'u1',
    name: 'Henry Oak',
    email: 'OakMaster@yahoo.com',
    password: 'Ga1a!',
  },
  {
    id: 'u2',
    name: 'Sparky the dog',
    email: 'sparks@gooddog.com',
    password: 'bone123',
  },
];

const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const getUsers = (req, res, next) => {
  const sendUsers = MOCKUSERS.map(({ password, ...rest }) => ({ ...rest }));
  res.status(200).json({ users: sendUsers });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  const sendUser = MOCKUSERS.find((user) => user.id === userId);

  if (!sendUser) {
    throw new HttpError(404, 'No user with provided id exists');
  }

  delete sendUser.password;
  res.status(200).json({ user: sendUser });
};

const createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(422, 'Invalid Inputs Passed.');
  }

  const { name, email, password } = req.body;

  const userExists = MOCKUSERS.find((user) => user.email === email);

  if (userExists) {
    throw new HttpError(422, 'Email already registered');
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  MOCKUSERS.push(newUser);
  res.status(200).json({ message: 'User saved', newUser });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  const userToLogin = MOCKUSERS.find(
    (user) => user.email === email && user.password === password
  );

  if (!userToLogin) {
    throw new HttpError(401, 'Username and password do not match');
  }

  delete userToLogin.password;
  res.status(200).json({ user: userToLogin });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.loginUser = loginUser;
