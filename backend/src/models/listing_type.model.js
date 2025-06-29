const db = require('../db');

/**
 * Finds all listing types.
 * @returns {Promise<Array>} A promise that resolves to an array of listing type objects.
 */
const findAll = async () => {
  const { rows } = await db.query('SELECT * FROM listing_types ORDER BY name ASC');
  return rows;
};

/**
 * Finds a single listing type by its ID.
 * @param {number} id The ID of the listing type to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the listing type object, or undefined if not found.
 */
const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM listing_types WHERE id = $1', [id]);
  return rows[0];
};

/**
 * Creates a new listing type.
 * @param {Object} typeData The data for the new type (name).
 * @returns {Promise<Object>} A promise that resolves to the newly created listing type object.
 */
const create = async ({ name }) => {
  const { rows } = await db.query(
    'INSERT INTO listing_types (name) VALUES ($1) RETURNING *',
    [name]
  );
  return rows[0];
};

/**
 * Updates an existing listing type.
 * @param {number} id The ID of the listing type to update.
 * @param {Object} typeData The new data for the type (name).
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated listing type object, or undefined if not found.
 */
const update = async (id, { name }) => {
  const { rows } = await db.query(
    'UPDATE listing_types SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return rows[0];
};

/**
 * Deletes a listing type.
 * @param {number} id The ID of the listing type to delete.
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 or 0).
 */
const remove = async (id) => {
  const result = await db.query('DELETE FROM listing_types WHERE id = $1', [id]);
  return result.rowCount;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};