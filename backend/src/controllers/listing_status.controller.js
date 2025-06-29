const ListingStatus = require('../models/listing_status.model');

/**
 * Retrieves all listing statuses.
 */
const getAllListingStatuses = async (req, res) => {
  try {
    const statuses = await ListingStatus.findAll();
    res.status(200).json(statuses);
  } catch (error) {
    console.error('Error fetching listing statuses:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching listing statuses.' });
  }
};

/**
 * Retrieves a single listing status by its ID.
 */
const getListingStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await ListingStatus.findById(id);
    if (!status) {
      return res.status(404).json({ message: 'Listing status not found' });
    }
    res.status(200).json(status);
  } catch (error) {
    console.error('Error fetching listing status by ID:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching the listing status.' });
  }
};

/**
 * Creates a new listing status.
 */
const createListingStatus = async (req, res) => {
  try {
    const newStatus = await ListingStatus.create(req.body);
    res.status(201).json(newStatus);
  } catch (error) {
    console.error('Error creating listing status:', error.stack);
    res.status(500).json({ message: 'An error occurred while creating the listing status.' });
  }
};

/**
 * Updates an existing listing status.
 */
const updateListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStatus = await ListingStatus.update(id, req.body);
    if (!updatedStatus) {
      return res.status(404).json({ message: 'Listing status not found' });
    }
    res.status(200).json(updatedStatus);
  } catch (error) {
    console.error('Error updating listing status:', error.stack);
    res.status(500).json({ message: 'An error occurred while updating the listing status.' });
  }
};

/**
 * Deletes a listing status.
 */
const deleteListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await ListingStatus.remove(id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Listing status not found' });
    }
    res.status(204).send(); // 204 No Content is standard for a successful deletion
  } catch (error) {
    console.error('Error deleting listing status:', error.stack);
    res.status(500).json({ message: 'An error occurred while deleting the listing status.' });
  }
};

module.exports = {
  getAllListingStatuses,
  getListingStatusById,
  createListingStatus,
  updateListingStatus,
  deleteListingStatus,
};