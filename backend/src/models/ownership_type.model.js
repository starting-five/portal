const db = require('../db');

/**
 * Finds all ownership types.
 * @returns {Promise<Array>} A promise that resolves to an array of ownership type objects.
 */
const findAll = async () => {
  const { rows } = await db.query('SELECT * FROM ownership_types ORDER BY name ASC');
  return rows;
};

/**
 * Finds a single ownership type by its ID.
 * @param {number} id The ID of the ownership type to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the ownership type object, or undefined if not found.
 */
const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM ownership_types WHERE id = $1', [id]);
  return rows[0];
};

/**
 * Creates a new ownership type.
 * @param {Object} typeData The data for the new type (name).
 * @returns {Promise<Object>} A promise that resolves to the newly created ownership type object.
 */
const create = async ({ name }) => {
  const { rows } = await db.query(
    'INSERT INTO ownership_types (name) VALUES ($1) RETURNING *',
    [name]
  );
  return rows[0];
};

/**
 * Updates an existing ownership type.
 * @param {number} id The ID of the ownership type to update.
 * @param {Object} typeData The new data for the type (name).
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated ownership type object, or undefined if not found.
 */
const update = async (id, { name }) => {
  const { rows } = await db.query(
    'UPDATE ownership_types SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return rows[0];
};

/**
 * Deletes an ownership type.
 * @param {number} id The ID of the ownership type to delete.
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 or 0).
 */
const remove = async (id) => {
  const result = await db.query('DELETE FROM ownership_types WHERE id = $1', [id]);
  return result.rowCount;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};