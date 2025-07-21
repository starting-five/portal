const db = require('../db');

/**
 * Finds all translations for ownership types.
 * @returns {Promise<Array>} Array of translation objects.
 */
const findAll = async () => {
  const { rows } = await db.query('SELECT * FROM ownership_type_translations');
  return rows;
};

/**
 * Finds translations for a specific ownership type and language.
 * @param {number} ownershipTypeId
 * @param {string} languageCode
 * @returns {Promise<Object|null>} Translation object or null.
 */
const findByTypeAndLanguage = async (ownershipTypeId, languageCode) => {
  const { rows } = await db.query(
    'SELECT * FROM ownership_type_translations WHERE ownership_type_id = $1 AND language_code = $2',
    [ownershipTypeId, languageCode]
  );
  return rows[0] || null;
};

module.exports = {
  findAll,
  findByTypeAndLanguage,
};
