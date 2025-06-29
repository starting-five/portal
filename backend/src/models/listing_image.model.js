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
 * Finds all listing images for a specific listing.
 * @param {number} listingId The ID of the listing to find images for.
 * @returns {Promise<Array>} A promise that resolves to an array of listing image objects.
 */
const findByListingId = async (listingId) => {
  const { rows } = await db.query('SELECT * FROM listing_images WHERE listing_id = $1 ORDER BY created_at ASC', [listingId]);
  return rows;
};

/**
 * Creates a new listing image.
 * @param {Object} imageData The data for the new image (listing_id, url, alt_text).
 * @returns {Promise<Object>} A promise that resolves to the newly created listing image object.
 */
const create = async ({ listing_id, url, alt_text }) => {
  const { rows } = await db.query(
    'INSERT INTO listing_images (listing_id, url, alt_text) VALUES ($1, $2, $3) RETURNING *',
    [listing_id, url, alt_text]
  );
  return rows[0];
};

/**
 * Updates an existing listing image.
 * @param {number} id The ID of the listing image to update.
 * @param {Object} imageData The new data for the image (url, alt_text).
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated listing image object, or undefined if not found.
 */
const update = async (id, { url, alt_text }) => {
  const { rows } = await db.query(
    'UPDATE listing_images SET url = $1, alt_text = $2 WHERE id = $3 RETURNING *',
    [url, alt_text, id]
  );
  return rows[0];
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
};