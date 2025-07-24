const FeatureCategory = require('../models/feature_category.model');

/**
 * Retrieves all feature categories with translations.
 */
const getAllFeatureCategories = async (req, res) => {
  try {
    const categories = await FeatureCategory.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching feature categories:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching feature categories.' });
  }
};

module.exports = { getAllFeatureCategories };
