const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('GET request in users');
  res.json({ message: 'it is working' });
});

module.exports = router;
