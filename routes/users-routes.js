const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  loginUser,
} = require('../controllers/users-controllers');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 5 }),
  ],
  createUser
);

router.post('/login', loginUser);

module.exports = router;
