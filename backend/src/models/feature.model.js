const db = require('../db');

/**
 * Finds all features.
 * @returns {Promise<Array>} A promise that resolves to an array of feature objects.
 */

// Returns all features with their category_key, sort_order, and translations (optionally filtered by language)
const findAll = async (language) => {
  if (language) {
    const { rows } = await db.query(`
      SELECT f.id, f.key, f.category_key, f.sort_order,
        json_agg(json_build_object('language_code', ft.language_code, 'name', ft.name)) FILTER (WHERE ft.language_code = $1) AS translations
      FROM features f
      LEFT JOIN features_translations ft ON f.id = ft.feature_id
      GROUP BY f.id, f.key, f.category_key, f.sort_order
      ORDER BY f.category_key, f.sort_order ASC
    `, [language]);
    // If a feature has no translation for the language, return an empty array for translations
    return rows.map(row => ({ ...row, translations: row.translations || [] }));
  } else {
    const { rows } = await db.query(`
      SELECT f.id, f.key, f.category_key, f.sort_order,
        json_agg(json_build_object('language_code', ft.language_code, 'name', ft.name)) AS translations
      FROM features f
      LEFT JOIN features_translations ft ON f.id = ft.feature_id
      GROUP BY f.id, f.key, f.category_key, f.sort_order
      ORDER BY f.category_key, f.sort_order ASC
    `);
    return rows;
  }
};

/**
 * Finds a single feature by its ID.
 * @param {number} id The ID of the feature to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the feature object, or undefined if not found.
 */
// Finds a single feature by its ID, with optional language filter for translations
const findById = async (id, language) => {
  if (language) {
    const { rows } = await db.query(`
      SELECT f.id, f.key, f.category_key, f.sort_order,
        json_agg(json_build_object('language_code', ft.language_code, 'name', ft.name)) FILTER (WHERE ft.language_code = $2) AS translations
      FROM features f
      LEFT JOIN features_translations ft ON f.id = ft.feature_id
      WHERE f.id = $1
      GROUP BY f.id, f.key, f.category_key, f.sort_order
    `, [id, language]);
    if (!rows[0]) return undefined;
    return { ...rows[0], translations: rows[0].translations || [] };
  } else {
    const { rows } = await db.query(`
      SELECT f.id, f.key, f.category_key, f.sort_order,
        json_agg(json_build_object('language_code', ft.language_code, 'name', ft.name)) AS translations
      FROM features f
      LEFT JOIN features_translations ft ON f.id = ft.feature_id
      WHERE f.id = $1
      GROUP BY f.id, f.key, f.category_key, f.sort_order
    `, [id]);
    return rows[0];
  }
};


/**
 * Creates a new feature with translations.
 * @param {Object} featureData The data for the new feature ({ key, category_key, sort_order, translations })
 * @returns {Promise<Object>} A promise that resolves to the newly created feature object.
 */
const create = async ({ key, category_key, sort_order, translations }) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const featureRes = await client.query(
      'INSERT INTO features (key, category_key, sort_order) VALUES ($1, $2, $3) RETURNING id, key, category_key, sort_order',
      [key, category_key, sort_order]
    );
    const feature = featureRes.rows[0];
    if (translations && translations.length > 0) {
      for (const t of translations) {
        await client.query(
          'INSERT INTO features_translations (feature_id, language_code, name) VALUES ($1, $2, $3)',
          [feature.id, t.language_code, t.name]
        );
      }
    }
    await client.query('COMMIT');
    return findById(feature.id);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};


/**
 * Updates an existing feature and its translations.
 * @param {number} id The ID of the feature to update.
 * @param {Object} featureData The new data for the feature ({ key, category_key, sort_order, translations })
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated feature object, or undefined if not found.
 */
const update = async (id, { key, category_key, sort_order, translations }) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const featureRes = await client.query(
      'UPDATE features SET key = $1, category_key = $2, sort_order = $3 WHERE id = $4 RETURNING id, key, category_key, sort_order',
      [key, category_key, sort_order, id]
    );
    if (!featureRes.rows[0]) {
      await client.query('ROLLBACK');
      return undefined;
    }
    // Remove old translations
    await client.query('DELETE FROM features_translations WHERE feature_id = $1', [id]);
    // Insert new translations
    if (translations && translations.length > 0) {
      for (const t of translations) {
        await client.query(
          'INSERT INTO features_translations (feature_id, language_code, name) VALUES ($1, $2, $3)',
          [id, t.language_code, t.name]
        );
      }
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