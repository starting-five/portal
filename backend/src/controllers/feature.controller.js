const Feature = require('../models/feature.model');

/**
 * Retrieves all features.
 */
const getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.findAll();
    // Map translations array to labels object
    const mapped = features.map(f => ({
      id: f.id,
      key: f.key,
      category_key: f.category_key,
      sort_order: f.sort_order,
      labels: (f.translations || []).reduce((acc, t) => {
        acc[t.language_code] = t.name;
        return acc;
      }, {})
    }));
    res.status(200).json(mapped);
  } catch (error) {
    console.error('Error fetching features:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching features.' });
  }
};

/**
 * Retrieves a single feature by its ID.
 */
const getFeatureById = async (req, res) => {
  try {
    const { id } = req.params;
    const feature = await Feature.findById(id);
    if (!feature) {
      return res.status(404).json({ message: 'Feature not found' });
    }
    // Map translations array to labels object
    const mapped = {
      id: feature.id,
      key: feature.key,
      category_key: feature.category_key,
      sort_order: feature.sort_order,
      labels: (feature.translations || []).reduce((acc, t) => {
        acc[t.language_code] = t.name;
        return acc;
      }, {})
    };
    res.status(200).json(mapped);
  } catch (error) {
    console.error('Error fetching feature by ID:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching the feature.' });
  }
};

/**
 * Creates a new feature.
 */
const createFeature = async (req, res) => {
  try {
    const newFeature = await Feature.create(req.body);
    res.status(201).json(newFeature);
  } catch (error) {
    console.error('Error creating feature:', error.stack);
    res.status(500).json({ message: 'An error occurred while creating the feature.' });
  }
};

/**
 * Updates an existing feature.
 */
const updateFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeature = await Feature.update(id, req.body);
    if (!updatedFeature) {
      return res.status(404).json({ message: 'Feature not found' });
    }
    res.status(200).json(updatedFeature);
  } catch (error) {
    console.error('Error updating feature:', error.stack);
    res.status(500).json({ message: 'An error occurred while updating the feature.' });
  }
};

/**
 * Deletes a feature.
 */
const deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await Feature.remove(id);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Feature not found' });
    }
    res.status(204).send(); // 204 No Content is standard for a successful deletion
  } catch (error) {
    console.error('Error deleting feature:', error.stack);
    res.status(500).json({ message: 'An error occurred while deleting the feature.' });
  }
};

module.exports = {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
};