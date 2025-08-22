const db = require('../db');

/**
 * Finds all listing images.
 * @returns {Promise<Array>} A promise that resolves to an array of listing image objects.
 */
const findAll = async () => {
  const { rows } = await db.query('SELECT * FROM listing_images ORDER BY listing_id, created_at ASC');
  return rows;
};

/**
 * Finds a single listing image by its ID.
 * @param {number} id The ID of the listing image to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the listing image object, or undefined if not found.
 */
const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM listing_images WHERE id = $1', [id]);
  return rows[0];
};

/**
 * Finds all listing images for a specific listing using public listing_id (string).
 * @param {string} listing_listingId The public listing_id to find images for.
 * @returns {Promise<Array>} A promise that resolves to an array of listing image objects.
 */
const findByListingId = async (listing_listingId) => {
  // Look up internal id from public listing_id
  const listingRes = await db.query('SELECT id FROM listings WHERE listing_id = $1', [listing_listingId]);
  if (!listingRes.rows.length) return [];
  const internalId = listingRes.rows[0].id;
  const { rows } = await db.query('SELECT * FROM listing_images WHERE listing_id = $1 ORDER BY sort_order ASC', [internalId]);
  return rows;
};

/**
 * Creates a new listing image.
 * @param {Object} imageData The data for the new image ({ listing_id: number, url: string, alt_text?: string }).
 * @returns {Promise<Object>} A promise that resolves to the newly created listing image object.
 * @note listing_id must be the internal DB id (number), not the public string id.
 */
const create = async ({ listing_id, url, alt_text, sort_order = 0 }) => {
  // listing_id must be a number (internal DB id)
  const { rows } = await db.query(
    'INSERT INTO listing_images (listing_id, url, alt_text, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
    [listing_id, url, alt_text, sort_order]
  );
  return rows[0];
};

/**
 * Updates an existing listing image.
 * @param {number} id The ID of the listing image to update.
 * @param {Object} imageData The new data for the image (url, alt_text).
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated listing image object, or undefined if not found.
 */
const update = async (id, { url, alt_text, sort_order }) => {
  const { rows } = await db.query(
    'UPDATE listing_images SET url = $1, alt_text = $2, sort_order = COALESCE($3, sort_order) WHERE id = $4 RETURNING *',
    [url, alt_text, sort_order, id]
  );
  return rows[0];
};


/**
 * Bulk creates listing images.
 * @param {Array<Object>} images Array of image objects ({ listing_id: number, url: string, alt_text?: string })
 * @returns {Promise<Array>} Array of newly created listing image objects.
 * @note listing_id must be the internal DB id (number), not the public string id.
 */
const bulkCreate = async (images) => {
  if (!images || images.length === 0) return [];
  const values = [];
  const params = [];
  images.forEach((img, i) => {
    // listing_id must be a number (internal DB id)
    values.push(`($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`);
    params.push(img.listing_id, img.url, img.alt_text || null, typeof img.sort_order === 'number' ? img.sort_order : i);
  });
  const query = `INSERT INTO listing_images (listing_id, url, alt_text, sort_order) VALUES ${values.join(", ")} RETURNING *`;
  const { rows } = await db.query(query, params);
  return rows;
};


/**
 * Deletes a listing image.
 * @param {number} id The ID of the listing image to delete.
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 or 0).
 */
const remove = async (id) => {
  const result = await db.query('DELETE FROM listing_images WHERE id = $1', [id]);
  return result.rowCount;
};

module.exports = {
  findAll,
  findById,
  findByListingId,
  create,
  update,
  remove,
  bulkCreate,
};