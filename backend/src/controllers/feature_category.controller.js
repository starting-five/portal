const FeatureCategory = require('../models/feature_category.model');

/**
 * Retrieves all feature categories with translations.
 */
const getAllFeatureCategories = async (req, res) => {
  try {
    const categories = await FeatureCategory.findAll();
    // Map translations array to labels object
    const mapped = categories.map(c => ({
      key: c.key,
      sort_order: c.sort_order,
      labels: (c.translations || []).reduce((acc, t) => {
        acc[t.language_code] = t.name;
        return acc;
      }, {})
    }));
    res.status(200).json(mapped);
  } catch (error) {
    console.error('Error fetching feature categories:', error.stack);
    res.status(500).json({ message: 'An error occurred while fetching feature categories.' });
  }
};

module.exports = { getAllFeatureCategories };
