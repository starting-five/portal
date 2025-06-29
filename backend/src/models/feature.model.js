const db = require('../db');

/**
 * Finds all features.
 * @returns {Promise<Array>} A promise that resolves to an array of feature objects.
 */
const findAll = async () => {
  const { rows } = await db.query('SELECT * FROM features ORDER BY category, name ASC');
  return rows;
};

/**
 * Finds a single feature by its ID.
 * @param {number} id The ID of the feature to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the feature object, or undefined if not found.
 */
const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM features WHERE id = $1', [id]);
  return rows[0];
};

/**
 * Creates a new feature.
 * @param {Object} featureData The data for the new feature (name, category).
 * @returns {Promise<Object>} A promise that resolves to the newly created feature object.
 */
const create = async ({ name, category }) => {
  const { rows } = await db.query(
    'INSERT INTO features (name, category) VALUES ($1, $2) RETURNING *',
    [name, category]
  );
  return rows[0];
};

/**
 * Updates an existing feature.
 * @param {number} id The ID of the feature to update.
 * @param {Object} featureData The new data for the feature (name, category).
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated feature object, or undefined if not found.
 */
const update = async (id, { name, category }) => {
  const { rows } = await db.query(
    'UPDATE features SET name = $1, category = $2 WHERE id = $3 RETURNING *',
    [name, category, id]
  );
  return rows[0];
};

/**
 * Deletes a feature.
 * @param {number} id The ID of the feature to delete.
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 or 0).
 */
const remove = async (id) => {
  const result = await db.query('DELETE FROM features WHERE id = $1', [id]);
  return result.rowCount;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};