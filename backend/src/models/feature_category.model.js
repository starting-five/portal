const db = require('../db');

/**
 * Finds all feature categories with translations.
 * @returns {Promise<Array>} Array of categories with translations.
 */
const findAll = async () => {
  const { rows } = await db.query(`
    SELECT fc.key, fc.sort_order, 
      json_agg(json_build_object('language_code', fct.language_code, 'name', fct.name)) AS translations
    FROM feature_categories fc
    LEFT JOIN feature_categories_translations fct ON fc.key = fct.category_key
    GROUP BY fc.key, fc.sort_order
    ORDER BY fc.sort_order ASC
  `);
  return rows;
};

module.exports = { findAll };
