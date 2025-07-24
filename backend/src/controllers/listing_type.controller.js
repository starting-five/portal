const ListingType = require('../models/listing_type.model');

/**
 * Retrieves all listing types.
 */
const getAllListingTypes = async (req, res) => {
  try {
    const types = await ListingType.findAll();
    res.status(200).json(types);
  } catch (error) {
    console.error('Error fetching listing types:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching listing types.' });
  }
};

/**
 * Retrieves a single listing type by its ID.
 */
const getListingTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = req.query.lang || 'en';
    const type = await ListingType.findById(id, lang);
    if (!type) {
      return res.status(404).json({ message: 'Listing type not found' });
    }
    res.status(200).json(type);
  } catch (error) {
    console.error('Error fetching listing type by ID:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching the listing type.' });
  }
};

/**
 * Creates a new listing type.
 */
const createListingType = async (req, res) => {
  try {
    const newType = await ListingType.create(req.body);
    res.status(201).json(newType);
  } catch (error) {
    console.error('Error creating listing type:', error.stack);
    res.status(500).json({ message: 'An error occurred while creating the listing type.' });
  }
};

/**
 * Updates an existing listing type.
 */
const updateListingType = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedType = await ListingType.update(id, req.body);
    if (!updatedType) {
      return res.status(404).json({ message: 'Listing type not found' });
    }
    res.status(200).json(updatedType);
  } catch (error) {
    console.error('Error updating listing type:', error.stack);
    res.status(500).json({ message: 'An error occurred while updating the listing type.' });
  }
};

/**
 * Deletes a listing type.
 */
const deleteListingType = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await ListingType.remove(id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Listing type not found' });
    }
    res.status(204).send(); // 204 No Content is standard for a successful deletion
  } catch (error) {
    console.error('Error deleting listing type:', error.stack);
    res.status(500).json({ message: 'An error occurred while deleting the listing type.' });
  }
};

module.exports = {
  getAllListingTypes,
  getListingTypeById,
  createListingType,
  deleteListingType,
  /**
   * Updates the translated name for a listing type.
   */
  updateListingTypeTranslation: async (req, res) => {
    try {
      const { id, lang } = req.params;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Missing translated name in request body.' });
      }
      const updated = await ListingType.updateTranslation(id, lang, name);
      if (!updated) {
        return res.status(404).json({ message: 'Listing type or translation not found.' });
      }
      res.status(200).json(updated);
    } catch (error) {
      console.error('Error updating listing type translation:', error.stack);
      res.status(500).json({ message: 'An error occurred while updating the listing type translation.' });
    }
  },
};