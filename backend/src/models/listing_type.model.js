const db = require('../db');

/**
 * Finds all listing types.
 * @returns {Promise<Array>} A promise that resolves to an array of listing type objects.
 */
// Finds all listing types with all translations
const findAll = async () => {
  const query = `
    SELECT lt.id,
           json_agg(json_build_object('language_code', ltt.language_code, 'name', ltt.name)) AS translations
    FROM listing_types lt
    LEFT JOIN listing_type_translations ltt ON lt.id = ltt.listing_type_id
    GROUP BY lt.id
    ORDER BY lt.id ASC;
  `;
  const { rows } = await db.query(query);
  return rows;
};

/**
 * Finds a single listing type by its ID.
 * @param {number} id The ID of the listing type to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the listing type object, or undefined if not found.
 */
// Finds a single listing type by ID with translation for requested language (fallback to English)
const findById = async (id, lang = 'en') => {
  const query = `
    SELECT lt.id,
           COALESCE(ltt.name, ltt_en.name) AS name
    FROM listing_types lt
    LEFT JOIN listing_type_translations ltt ON lt.id = ltt.listing_type_id AND ltt.language_code = $2
    LEFT JOIN listing_type_translations ltt_en ON lt.id = ltt_en.listing_type_id AND ltt_en.language_code = 'en'
    WHERE lt.id = $1;
  `;
  const { rows } = await db.query(query, [id, lang]);
  return rows[0];
};

/**
 * Creates a new listing type.
 * @param {Object} typeData The data for the new type (name).
 * @returns {Promise<Object>} A promise that resolves to the newly created listing type object.
 */
// Creates a new listing type and its translations
const create = async ({ translations }) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    // Insert into listing_types
    const typeRes = await client.query('INSERT INTO listing_types DEFAULT VALUES RETURNING id');
    const typeId = typeRes.rows[0].id;
    // Insert translations
    for (const t of translations) {
      await client.query(
        'INSERT INTO listing_type_translations (listing_type_id, language_code, name) VALUES ($1, $2, $3)',
        [typeId, t.language_code, t.name]
      );
    }
    await client.query('COMMIT');
    return findById(typeId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Updates an existing listing type.
 * @param {number} id The ID of the listing type to update.
 * @param {Object} typeData The new data for the type (name).
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated listing type object, or undefined if not found.
 */
// Updates translations for a listing type
const update = async (id, { translations }) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    // Remove old translations
    await client.query('DELETE FROM listing_type_translations WHERE listing_type_id = $1', [id]);
    // Insert new translations
    for (const t of translations) {
      await client.query(
        'INSERT INTO listing_type_translations (listing_type_id, language_code, name) VALUES ($1, $2, $3)',
        [id, t.language_code, t.name]
      );
    }
    await client.query('COMMIT');
    return findById(id);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
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
  /**
   * Updates a translation for a listing type.
   * @param {number} id The ID of the listing type.
   * @param {string} lang The language code.
   * @param {string} name The new translated name.
   * @returns {Promise<Object|undefined>} The updated listing type object, or undefined if not found.
   */
  updateTranslation: async (id, lang, name) => {
    // Check if listing type exists
    const typeRes = await db.query('SELECT id FROM listing_types WHERE id = $1', [id]);
    if (typeRes.rowCount === 0) return undefined;
    // Update translation (if exists), else insert
    const transRes = await db.query(
      'UPDATE listing_type_translations SET name = $1 WHERE listing_type_id = $2 AND language_code = $3',
      [name, id, lang]
    );
    if (transRes.rowCount === 0) {
      // Insert if not exists
      await db.query(
        'INSERT INTO listing_type_translations (listing_type_id, language_code, name) VALUES ($1, $2, $3)',
        [id, lang, name]
      );
    }
    return findById(id, lang);
  },
};