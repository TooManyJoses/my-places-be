let MOCKPLACES = [
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

const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const getPlaceById = (req, res, next) => {
  const { placeId } = req.params;
  const place = MOCKPLACES.find((place) => placeId === place.id);

  if (!place) {
    throw new HttpError(404, 'No place with provided id exists');
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const { userId } = req.params;
  const placesByUser = MOCKPLACES.filter((place) => place.creator === userId);

  if (!placesByUser) {
    throw new HttpError(404, 'No place for provided user id exists');
  }
  res.json({ places: placesByUser });
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(422, 'Invalid Inputs Passed.');

  }

  const { title, description, coordinates, address, creator } = req.body;

  const newPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  MOCKPLACES.push(newPlace);

  res.status(201).json({ place: newPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(422, 'Invalid Inputs Passed.');
  }

  const { placeId } = req.params;
  const placeToUpdate = { ...MOCKPLACES.find((place) => place.id === placeId) };
  const index = MOCKPLACES.findIndex((place) => place.id === placeId);

  placeToUpdate.title = req.body.title;
  placeToUpdate.description = req.body.description;

  MOCKPLACES[index] = placeToUpdate;

  res.status(200).json({ updatedPlace: placeToUpdate });
};

const deletePlace = (req, res, next) => {
  const { placeId } = req.params;
  MOCKPLACES = MOCKPLACES.filter((place) => place.id !== placeId);

  res.status(202).json({ message: 'Deleted Place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
