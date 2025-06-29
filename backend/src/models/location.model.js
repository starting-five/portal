const db = require('../db');

/**
 * Finds all locations.
 * @returns {Promise<Array>} A promise that resolves to an array of location objects.
 */
const findAll = async () => {
  const { rows } = await db.query('SELECT * FROM locations ORDER BY name ASC');
  return rows;
};

/**
 * Finds a single location by its ID.
 * @param {number} id The ID of the location to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the location object, or undefined if not found.
 */
const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM locations WHERE id = $1', [id]);
  return rows[0];
};

/**
 * Creates a new location.
 * @param {Object} locationData The data for the new location (name).
 * @returns {Promise<Object>} A promise that resolves to the newly created location object.
 */
const create = async ({ name }) => {
  const { rows } = await db.query(
    'INSERT INTO locations (name) VALUES ($1) RETURNING *',
    [name]
  );
  return rows[0];
};

/**
 * Updates an existing location.
 * @param {number} id The ID of the location to update.
 * @param {Object} locationData The new data for the location (name).
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated location object, or undefined if not found.
 */
const update = async (id, { name }) => {
  const { rows } = await db.query(
    'UPDATE locations SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return rows[0];
};

/**
 * Deletes a location.
 * @param {number} id The ID of the location to delete.
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 or 0).
 */
const remove = async (id) => {
  const result = await db.query('DELETE FROM locations WHERE id = $1', [id]);
  return result.rowCount;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};