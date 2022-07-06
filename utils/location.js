const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyDFwWtHDQDVwjBENptp4SV6NreR0xRHDxI';
const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

const getCoordinatesFromAddress = async (address) => {
  const response = await axios.get(
    `${BASE_URL}${encodeURIComponent(address)}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      422,
      'Could not location for specified address'
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
};

module.exports = getCoordinatesFromAddress;