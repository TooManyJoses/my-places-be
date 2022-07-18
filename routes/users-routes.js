const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const {
  getUsers,
  getUserById,
  signUpUser,
  loginUser,
} = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 8 }),
  ],
  signUpUser
);

router.post('/login', loginUser);

module.exports = router;
