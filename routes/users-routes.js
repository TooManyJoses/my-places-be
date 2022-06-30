const express = require('express');

const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  loginUser
} = require('../controllers/users-controllers');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post('/signup', createUser);

router.post('/login', loginUser)

module.exports = router;
