const Listing = require('../models/listing.model');

/**
 * Retrieves all listings, or a filtered list if query parameters are provided.
 */
const getAllListings = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    // Fetch listings with translations for the requested language
    const listings = await Listing.findAllWithTranslations(lang); // Or Listing.findByFiltersWithTranslations(req.query, lang);
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
    const lang = req.query.lang || 'en';
    // Fetch listing with translation for the requested language
    const listing = await Listing.findByPublicIdWithTranslation(listing_id, lang);
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
    // Only use supported fields for creating a listing
    const { currency, ...rest } = req.body;
    const newListing = await Listing.create(rest);
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
    // Only use supported fields for updating a listing
    // Remove unsupported fields from req.body
    const { currency, currency_id, price_unit, ...rest } = req.body;
    const updatedListing = await Listing.updateByPublicId(listing_id, rest);
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