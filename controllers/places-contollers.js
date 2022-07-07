let MOCKPLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u2',
  },
];

const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const getCoordinatesFromAddress = require('../utils/location');
const Place = require('../models/place');

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

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError(422, 'Invalid Inputs Passed.'));
  }

  const { title, description, address, creator } = req.body;
  let coordinates;

  try {
    coordinates = await getCoordinatesFromAddress(address);
  } catch (error) {
    return next(error);
  }

  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://media.istockphoto.com/photos/bamberg-city-in-germany-town-hall-building-in-background-with-blue-picture-id1215395349?k=20&m=1215395349&s=612x612&w=0&h=r3m5mTYdf_W4AUHTP8pBE5z1r23WKnu9tGGfyRdwFu8=',
    creator,
  });

  try {
    await newPlace.save();
  } catch (err) {
    const error = new HttpError(500, 'Creating place failed. Please try again');
    return next(error);
  }

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
  if (!MOCKPLACES.find((place) => place.id === placeId)) {
    throw new HttpError(404, 'Could not find place with given id.');
  }
  MOCKPLACES = MOCKPLACES.filter((place) => place.id !== placeId);
  res.status(202).json({ message: 'Deleted Place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
