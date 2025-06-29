const Location = require('../models/location.model');

/**
 * Retrieves all locations.
 */
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching locations.' });
  }
};

/**
 * Retrieves a single location by its ID.
 */
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    console.error('Error fetching location by ID:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching the location.' });
  }
};

/**
 * Creates a new location.
 */
const createLocation = async (req, res) => {
  try {
    const newLocation = await Location.create(req.body);
    res.status(201).json(newLocation);
  } catch (error) {
    console.error('Error creating location:', error.stack);
    res.status(500).json({ message: 'An error occurred while creating the location.' });
  }
};

/**
 * Updates an existing location.
 */
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLocation = await Location.update(id, req.body);
    if (!updatedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(updatedLocation);
  } catch (error) {
    console.error('Error updating location:', error.stack);
    res.status(500).json({ message: 'An error occurred while updating the location.' });
  }
};

/**
 * Deletes a location.
 */
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await Location.remove(id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(204).send(); // 204 No Content is standard for a successful deletion
  } catch (error) {
    console.error('Error deleting location:', error.stack);
    res.status(500).json({ message: 'An error occurred while deleting the location.' });
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};