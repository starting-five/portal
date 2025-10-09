const ListingStatus = require('../models/listing_status.model');


// Get all listing statuses with translations
const getAllListingStatuses = async (req, res) => {
  try {
    // Always return all listing statuses with labels object
    const statuses = await ListingStatus.findAll();
    const formatted = statuses.map(s => ({
      id: s.id,
      key: s.key,
      labels: Array.isArray(s.translations)
        ? s.translations.reduce((acc, t) => {
            if (t.language_code && t.name) acc[t.language_code] = t.name;
            return acc;
          }, {})
        : {}
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching listing statuses:', error.stack);
    res.status(500).json({ error: 'Failed to fetch listing statuses.' });
  }
};

// Get a single listing status by ID with all translations
const getListingStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    // Always return the status with labels object
    const statuses = await ListingStatus.findAll();
    const found = statuses.find(s => String(s.id) === String(id));
    if (!found) {
      return res.status(404).json({ error: 'Listing status not found.' });
    }
    const formatted = {
      id: found.id,
      key: found.key,
      labels: Array.isArray(found.translations)
        ? found.translations.reduce((acc, t) => {
            if (t.language_code && t.name) acc[t.language_code] = t.name;
            return acc;
          }, {})
        : {}
    };
    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching listing status by ID:', error.stack);
    res.status(500).json({ error: 'Failed to fetch listing status.' });
  }
};

// Create a new listing status with translations
const createListingStatus = async (req, res) => {
  const { key, translations } = req.body;
  if (!key || typeof key !== 'string' || !key.trim()) {
    return res.status(400).json({ error: 'Key is required and must be a non-empty string.' });
  }
  if (!Array.isArray(translations) || translations.length === 0) {
    return res.status(400).json({ error: 'Translations array required.' });
  }
  try {
    const newStatus = await ListingStatus.create({ key: key.trim(), translations });
    res.status(201).json(newStatus);
  } catch (error) {
    console.error('Error creating listing status:', error.stack);
    res.status(500).json({ error: 'Failed to create listing status.' });
  }
};

// Update an existing listing status and its translations
const updateListingStatus = async (req, res) => {
  const { id } = req.params;
  const { key, translations } = req.body;
  if (!key || typeof key !== 'string' || !key.trim()) {
    return res.status(400).json({ error: 'Key is required and must be a non-empty string.' });
  }
  if (!Array.isArray(translations) || translations.length === 0) {
    return res.status(400).json({ error: 'Translations array required.' });
  }
  try {
    const updatedStatus = await ListingStatus.update(id, { key: key.trim(), translations });
    if (!updatedStatus) {
      return res.status(404).json({ error: 'Listing status not found.' });
    }
    res.status(200).json(updatedStatus);
  } catch (error) {
    console.error('Error updating listing status:', error.stack);
    res.status(500).json({ error: 'Failed to update listing status.' });
  }
};

// Delete a listing status
const deleteListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await ListingStatus.remove(id);
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Listing status not found.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting listing status:', error.stack);
    res.status(500).json({ error: 'Failed to delete listing status.' });
  }
};

module.exports = {
  getAllListingStatuses,
  getListingStatusById,
  createListingStatus,
  updateListingStatus,
  deleteListingStatus,
};