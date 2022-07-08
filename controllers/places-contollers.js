const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const getCoordinatesFromAddress = require('../utils/location');
const Place = require('../models/place');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');

const getPlaceById = async (req, res, next) => {
  const { placeId } = req.params;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(500, 'Something went wrong.');
    return next(error);
  }

  if (!place) {
    const error = new HttpError(404, 'No place with provided id exists');
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const { userId } = req.params;
  let placesByUser;
  try {
    placesByUser = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      500,
      'Something went wrong. Could not find place.'
    );
    return next(error);
  }

  if (!placesByUser) {
    const error = new HttpError(404, 'No place for provided user id exists');
    return next(error);
  }
  res.json({
    places: placesByUser.map((place) => place.toObject({ getters: true })),
  });
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

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(500, 'Creating place failed. Please try again');
    return next(error);
  }

  if (!user) {
    const error = new HttpError(404, 'User not found');
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newPlace.save({ session });
    user.places.push(newPlace);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(500, 'Creating place failed. Please try again');
    return next(error);
  }

  res.status(201).json({ place: newPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = HttpError(422, 'Invalid Inputs Passed.');
    return next(err);
  }

  const { placeId } = req.params;
  let placeToUpdate;
  try {
    placeToUpdate = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      500,
      'Something went wrong. Could not find place.'
    );
    return next(error);
  }

  placeToUpdate.title = req.body.title;
  placeToUpdate.description = req.body.description;

  try {
    await placeToUpdate.save();
  } catch (err) {
    const error = new HttpError(
      500,
      'Something went wrong. COuld not update place.'
    );
    return next(error);
  }

  res.status(200).json({ place: placeToUpdate.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const { placeId } = req.params;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      500,
      'Something went wrong. Could not delete place.'
    );
    return next(error);
  }
  if (!place) {
    const error = new HttpError(404, 'Could not find place with given id.');
    return next(error);
  }

  try {
    await place.remove();
  } catch (err) {
    const error = new HttpError(
      500,
      'Something went wrong. Could not delete place.'
    );
    return next(error);
  }
  res.status(202).json({ message: 'Deleted Place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
