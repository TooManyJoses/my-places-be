const express = require('express');

const HttpError = require('../models/http-error');

const router = express.Router();

const mockPlaces = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u2',
  },
];

router.get('/', (req, res, next) => {
  console.log('GET request in places');
  res.json({ message: 'it works' });
});

router.get('/:placeId', (req, res, next) => {
  const placeId = req.params.placeId;
  const place = mockPlaces.find((place) => placeId === place.id);

  if (!place) {
    throw new HttpError(404, 'No place with provided id exists');
  }

  res.json({ place });
});

router.get('/user/:userId', (req, res, next) => {
  const userId = req.params.userId;
  const placesByUser = mockPlaces.filter((place) => place.creator === userId);

  if (!placesByUser) {
    throw new HttpError(404, 'No place for provided user id exists');
  }
  res.json({ places: placesByUser });
});

module.exports = router;
