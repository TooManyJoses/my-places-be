const express = require('express');

const { getPlaceById, getPlacesByUserId} = require('../controllers/places-contollers');

const router = express.Router();

router.get('/:placeId', getPlaceById);

router.get('/user/:userId', getPlacesByUserId);

module.exports = router;
