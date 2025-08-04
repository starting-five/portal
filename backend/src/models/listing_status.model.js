/**
 * Finds a single listing status by its ID and language (with fallback to English).
 * @param {number} id The ID of the listing status to find.
 * @param {string} lang The language code.
 * @returns {Promise<Object|undefined>} A promise that resolves to the listing status object, or undefined if not found.
 */
const findById = async (id, lang = "en") => {
  const { rows } = await pool.query(
    `
    SELECT ls.id, ls.key,
           COALESCE(lst.name, lst_en.name) AS name
    FROM listing_statuses ls
    LEFT JOIN listing_statuses_translations lst ON ls.id = lst.listing_status_id AND lst.language_code = $2
    LEFT JOIN listing_statuses_translations lst_en ON ls.id = lst_en.listing_status_id AND lst_en.language_code = 'en'
    WHERE ls.id = $1;
  `,
    [id, lang]
  );
  return rows[0];
};
const { pool } = require("../db");

/**
 * Finds all listing statuses with all translations.
 * @returns {Promise<Array>} A promise that resolves to an array of listing status objects with translations.
 */
const findAll = async () => {
  const { rows } = await pool.query(`
    SELECT ls.id, ls.key,
           json_agg(json_build_object('language_code', lst.language_code, 'name', lst.name)) AS translations
    FROM listing_statuses ls
    LEFT JOIN listing_statuses_translations lst ON ls.id = lst.listing_status_id
    GROUP BY ls.id, ls.key
    ORDER BY ls.id ASC
  `);
  return rows;
};

/**
 * Creates a new listing status with translations.
 * @param {Object} statusData The data for the new status ({ key, translations })
 * @returns {Promise<Object>} The created status with translations
 */
const create = async ({ key, translations }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const statusRes = await client.query(
      "INSERT INTO listing_statuses (key) VALUES ($1) RETURNING id, key",
      [key]
    );
    const status = statusRes.rows[0];
    const values = [];
    const placeholders = [];
    translations.forEach((t, i) => {
      values.push(status.id, t.language_code, t.name);
      placeholders.push(`($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`);
    });
    if (values.length > 0) {
      await client.query(
        `INSERT INTO listing_statuses_translations (listing_status_id, language_code, name) VALUES ${placeholders.join(
          ", "
        )}`,
        values
      );
    }
    await client.query("COMMIT");
    return {
      id: status.id,
      key: status.key,
      translations,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Updates an existing listing status and its translations.
 * @param {number} id The ID of the listing status to update.
 * @param {Object} statusData The new data ({ key, translations })
 * @returns {Promise<Object|undefined>} The updated status with translations, or undefined if not found
 */
const update = async (id, { key, translations }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const statusRes = await client.query(
      "UPDATE listing_statuses SET key = $1 WHERE id = $2 RETURNING id, key",
      [key, id]
    );
    if (!statusRes.rows[0]) {
      await client.query("ROLLBACK");
      return undefined;
    }
    // Remove existing translations
    await client.query(
      "DELETE FROM listing_statuses_translations WHERE listing_status_id = $1",
      [id]
    );
    // Insert new translations
    const values = [];
    const placeholders = [];
    translations.forEach((t, i) => {
      values.push(id, t.language_code, t.name);
      placeholders.push(`($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`);
    });
    if (values.length > 0) {
      await client.query(
        `INSERT INTO listing_statuses_translations (listing_status_id, language_code, name) VALUES ${placeholders.join(
          ", "
        )}`,
        values
      );
    }
    await client.query("COMMIT");
    return {
      id,
      key,
      translations,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Deletes a listing status.
 * @param {number} id The ID of the listing status to delete.
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 or 0).
 */
const remove = async (id) => {
  const result = await pool.query(
    "DELETE FROM listing_statuses WHERE id = $1",
    [id]
  );
  return result.rowCount;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
