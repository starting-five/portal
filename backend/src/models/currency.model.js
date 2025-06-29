const db = require('../db');

/**
 * Finds all currencies.
 * @returns {Promise<Array>} A promise that resolves to an array of currency objects.
 */
const findAll = async () => {
  const { rows } = await db.query('SELECT * FROM currencies ORDER BY code ASC');
  return rows;
};

/**
 * Finds a single currency by its ID.
 * @param {number} id The ID of the currency to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the currency object, or undefined if not found.
 */
const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM currencies WHERE id = $1', [id]);
  return rows[0];
};

/**
 * Creates a new currency.
 * @param {Object} currencyData The data for the new currency (code, name).
 * @returns {Promise<Object>} A promise that resolves to the newly created currency object.
 */
const create = async ({ code, name }) => {
  const { rows } = await db.query(
    'INSERT INTO currencies (code, name) VALUES ($1, $2) RETURNING *',
    [code, name]
  );
  return rows[0];
};

/**
 * Updates an existing currency.
 * @param {number} id The ID of the currency to update.
 * @param {Object} currencyData The new data for the currency (code, name).
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated currency object, or undefined if not found.
 */
const update = async (id, { code, name }) => {
  const { rows } = await db.query(
    'UPDATE currencies SET code = $1, name = $2 WHERE id = $3 RETURNING *',
    [code, name, id]
  );
  return rows[0];
};

/**
 * Deletes a currency.
 * @param {number} id The ID of the currency to delete.
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 or 0).
 */
const remove = async (id) => {
  const result = await db.query('DELETE FROM currencies WHERE id = $1', [id]);
  return result.rowCount;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};