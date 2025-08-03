const db = require("../db");

/**
 * Finds all ownership types.
 * @returns {Promise<Array>} A promise that resolves to an array of ownership type objects.
 */
// Finds all ownership types with all translations
const findAll = async () => {
  const { rows } = await db.query(`
    SELECT ot.id,
           ot.key,
           ot.sort_order,
           COALESCE(
             json_object_agg(ott.language_code, ott.name) FILTER (WHERE ott.language_code IS NOT NULL),
             '{}'
           ) AS labels
    FROM ownership_types ot
    LEFT JOIN ownership_type_translations ott ON ot.id = ott.ownership_type_id
    GROUP BY ot.id
    ORDER BY ot.sort_order ASC, ot.id ASC
  `);
  return rows;
};

/**
 * Finds a single ownership type by its ID.
 * @param {number} id The ID of the ownership type to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the ownership type object, or undefined if not found.
 */
const findById = async (id) => {
  const { rows } = await db.query(
    `
    SELECT ot.id,
           ot.key,
           ot.sort_order,
           COALESCE(
             json_object_agg(ott.language_code, ott.name) FILTER (WHERE ott.language_code IS NOT NULL),
             '{}'
           ) AS labels
    FROM ownership_types ot
    LEFT JOIN ownership_type_translations ott ON ot.id = ott.ownership_type_id
    WHERE ot.id = $1
    GROUP BY ot.id
  `,
    [id]
  );
  return rows[0];
};

/**
 * Creates a new ownership type.
 * @param {Object} typeData The data for the new type (name).
 * @returns {Promise<Object>} A promise that resolves to the newly created ownership type object.
 */
const create = async ({ name }) => {
  // Only insert with key/code, not name
  throw new Error(
    "Direct creation of ownership types is not supported. Use seed or admin logic."
  );
};

/**
 * Updates an existing ownership type.
 * @param {number} id The ID of the ownership type to update.
 * @param {Object} typeData The new data for the type (name).
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated ownership type object, or undefined if not found.
 */
const update = async (id, { name }) => {
  // Only update key/code, not name
  throw new Error(
    "Direct update of ownership types is not supported. Use seed or admin logic."
  );
};

/**
 * Deletes an ownership type.
 * @param {number} id The ID of the ownership type to delete.
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 or 0).
 */
const remove = async (id) => {
  const result = await db.query("DELETE FROM ownership_types WHERE id = $1", [
    id,
  ]);
  return result.rowCount;
};

module.exports = {
  findAll,
  findById,
  remove,
};
