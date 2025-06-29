const db = require('../db');

/**
 * Finds all price units.
 * @returns {Promise<Array>} A promise that resolves to an array of price unit objects.
 */
const findAll = async () => {
  const { rows } = await db.query('SELECT * FROM price_units ORDER BY name ASC');
  return rows;
};

/**
 * Finds a single price unit by its ID.
 * @param {number} id The ID of the price unit to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the price unit object, or undefined if not found.
 */
const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM price_units WHERE id = $1', [id]);
  return rows[0];
};

/**
 * Creates a new price unit.
 * @param {Object} unitData The data for the new unit (name).
 * @returns {Promise<Object>} A promise that resolves to the newly created price unit object.
 */
const create = async ({ name }) => {
  const { rows } = await db.query(
    'INSERT INTO price_units (name) VALUES ($1) RETURNING *',
    [name]
  );
  return rows[0];
};

/**
 * Updates an existing price unit.
 * @param {number} id The ID of the price unit to update.
 * @param {Object} unitData The new data for the unit (name).
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated price unit object, or undefined if not found.
 */
const update = async (id, { name }) => {
  const { rows } = await db.query(
    'UPDATE price_units SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return rows[0];
};

/**
 * Deletes a price unit.
 * @param {number} id The ID of the price unit to delete.
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 or 0).
 */
const remove = async (id) => {
  const result = await db.query('DELETE FROM price_units WHERE id = $1', [id]);
  return result.rowCount;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};