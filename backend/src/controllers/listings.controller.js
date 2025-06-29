const Listing = require('../models/listing.model');

/**
 * Retrieves all listings, or a filtered list if query parameters are provided.
 */
const getAllListings = async (req, res) => {
  try {
    // This can be extended to pass req.query to a filter function
    const listings = await Listing.findAll(); // Or Listing.findByFilters(req.query);
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching listings.' });
  }
};

/**
 * Retrieves a single listing by its ID.
 */
const getListingById = async (req, res) => {
  try {
    const { listing_id } = req.params;
    const listing = await Listing.findByPublicId(listing_id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching listing by ID:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching the listing.' });
  }
};

/**
 * Creates a new listing.
 */
const createListing = async (req, res) => {
  try {
    // In a real app, you'd get IDs for location, type, etc. from the request body
    const newListing = await Listing.create(req.body);
    res.status(201).json(newListing);
  } catch (error) {
    console.error('Error creating listing:', error.stack);
    res.status(500).json({ message: 'An error occurred while creating the listing.' });
  }
};

/**
 * Updates an existing listing.
 */
const updateListing = async (req, res) => {
  try {
    const { listing_id } = req.params;
    const updatedListing = await Listing.updateByPublicId(listing_id, req.body);
    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error('Error updating listing:', error.stack);
    res.status(500).json({ message: 'An error occurred while updating the listing.' });
  }
};

/**
 * Deletes a listing by its ID.
 */
const deleteListing = async (req, res) => {
  try {
    const { listing_id } = req.params;
    const deletedCount = await Listing.removeByPublicId(listing_id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(204).send(); // 204 No Content is standard for a successful deletion
  } catch (error) {
    console.error('Error deleting listing:', error.stack);
    res.status(500).json({ message: 'An error occurred while deleting the listing.' });
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};