const db = require('../db');

/**
 * Finds all listing statuses.
 * @returns {Promise<Array>} A promise that resolves to an array of listing status objects.
 */
const findAll = async () => {
  const { rows } = await db.query('SELECT * FROM listing_statuses ORDER BY name ASC');
  return rows;
};

/**
 * Finds a single listing status by its ID.
 * @param {number} id The ID of the listing status to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the listing status object, or undefined if not found.
 */
const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM listing_statuses WHERE id = $1', [id]);
  return rows[0];
};

/**
 * Creates a new listing status.
 * @param {Object} statusData The data for the new status (name).
 * @returns {Promise<Object>} A promise that resolves to the newly created listing status object.
 */
const create = async ({ name }) => {
  const { rows } = await db.query(
    'INSERT INTO listing_statuses (name) VALUES ($1) RETURNING *',
    [name]
  );
  return rows[0];
};

/**
 * Updates an existing listing status.
 * @param {number} id The ID of the listing status to update.
 * @param {Object} statusData The new data for the status (name).
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated listing status object, or undefined if not found.
 */
const update = async (id, { name }) => {
  const { rows } = await db.query(
    'UPDATE listing_statuses SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return rows[0];
};

/**
 * Deletes a listing status.
 * @param {number} id The ID of the listing status to delete.
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 or 0).
 */
const remove = async (id) => {
  const result = await db.query('DELETE FROM listing_statuses WHERE id = $1', [id]);
  return result.rowCount;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};