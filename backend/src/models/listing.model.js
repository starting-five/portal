const db = require('../db');


/**
 * Finds all listings and aggregates their related data (prices, images, features).
 * @returns {Promise<Array>} A promise that resolves to an array of listing objects.
 */
const findAll = async () => {
  const query = `
    SELECT
      l.*,
      loc.name AS location,
      lt.name AS listing_type,
      ot.name AS ownership_type,
      ls.name AS status,
      l.price,
      c.code as currency,
      pu.name AS price_unit,
      COALESCE(json_agg(DISTINCT li.*) FILTER (WHERE li.id IS NOT NULL), '[]') AS images,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', f.id, 'name', f.name, 'category', f.category)) FILTER (WHERE f.id IS NOT NULL), '[]') AS features
    FROM listings l
    LEFT JOIN locations loc ON l.location_id = loc.id
    LEFT JOIN listing_types lt ON l.listing_type_id = lt.id
    LEFT JOIN ownership_types ot ON l.ownership_type_id = ot.id
    LEFT JOIN listing_statuses ls ON l.status_id = ls.id
    LEFT JOIN price_units pu ON l.price_unit_id = pu.id
    LEFT JOIN currencies c ON l.currency_id = c.id
    LEFT JOIN listing_images li ON l.id = li.listing_id
    LEFT JOIN listing_features lf ON l.id = lf.listing_id
    LEFT JOIN features f ON lf.feature_id = f.id
    GROUP BY l.id, loc.name, lt.name, ot.name, ls.name, c.code, pu.name
    ORDER BY l.created_at DESC;
  `;
  const { rows } = await db.query(query);
  return rows;
};

/**
 * Finds a single listing by its public listing_id and aggregates its related data.
 * @param {string} publicListingId The human-readable unique ID of the listing to find (e.g., 1234-5678).
 * @returns {Promise<Object|undefined>} A promise that resolves to the listing object, or undefined if not found.
 */
const findByPublicId = async (id) => {
  const query = `
    SELECT
      l.*,
      loc.name AS location,
      lt.name AS listing_type,
      ot.name AS ownership_type,
      ls.name AS status,
      l.price,
      c.code as currency,
      pu.name AS price_unit,
      COALESCE(json_agg(DISTINCT li.*) FILTER (WHERE li.id IS NOT NULL), '[]') AS images,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', f.id, 'name', f.name, 'category', f.category)) FILTER (WHERE f.id IS NOT NULL), '[]') AS features
    FROM listings l
    LEFT JOIN locations loc ON l.location_id = loc.id
    LEFT JOIN listing_types lt ON l.listing_type_id = lt.id
    LEFT JOIN ownership_types ot ON l.ownership_type_id = ot.id
    LEFT JOIN listing_statuses ls ON l.status_id = ls.id
    LEFT JOIN price_units pu ON l.price_unit_id = pu.id
    LEFT JOIN currencies c ON l.currency_id = c.id
    LEFT JOIN listing_images li ON l.id = li.listing_id
    LEFT JOIN listing_features lf ON l.id = lf.listing_id
    LEFT JOIN features f ON lf.feature_id = f.id
    WHERE l.listing_id = $1 -- Changed from l.id to l.listing_id
    GROUP BY l.id, loc.name, lt.name, ot.name, ls.name, c.code, pu.name;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

/**
 * Creates a new listing and its associated data in a transaction.
 * @param {Object} listingData The data for the new listing.
 * @returns {Promise<Object>} A promise that resolves to the newly created listing object.
 */
const create = async (listingData) => {
  const { images, features, ...listing } = listingData;
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // Dynamically build the INSERT query for only provided fields
    const keys = Object.keys(listing).filter((k) => listing[k] !== undefined && listing[k] !== "");
    const columns = keys.map((k) => k.replace(/([A-Z])/g, "_$1").toLowerCase()).join(", ");
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const values = keys.map((k) => listing[k]);

    const listingQuery = `
      INSERT INTO listings (${columns})
      VALUES (${placeholders})
      RETURNING id, listing_id;
    `;
    const listingResult = await client.query(listingQuery, values);
    const { id: newListingId, listing_id: newPublicId } = listingResult.rows[0];

    // Insert images... (logic for images would go here)
    // if (images && images.length > 0) {
    //   ...
    // }

    // Link features
    if (features && features.length > 0) {
      for (const featureId of features) {
        await client.query(
          'INSERT INTO listing_features (listing_id, feature_id) VALUES ($1, $2)',
          [newListingId, featureId]
        );
      }
    }

    await client.query('COMMIT');
    return findByPublicId(newPublicId);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating listing:', error.message, error.stack);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Updates an existing listing.
 * @param {string} publicListingId The public listing_id of the listing to update.
 * @param {Object} listingData The new data for the listing.
 * @returns {Promise<Object>} A promise that resolves to the updated listing object.
 */
const updateByPublicId = async (publicListingId, listingData) => {
  const { features, ...listingDetails } = listingData;
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // First, get the internal ID from the public listing_id
    const listingResult = await client.query('SELECT id FROM listings WHERE listing_id = $1', [publicListingId]);
    if (listingResult.rows.length === 0) {
      throw new Error('Listing not found'); // Or handle as appropriate
    }
    const id = listingResult.rows[0].id;

    // Dynamically build the SET part of the UPDATE query for the listings table
    const listingFields = Object.keys(listingDetails);
    if (listingFields.length > 0) {
      const setClauses = listingFields.map((field, i) => `${field.replace(/([A-Z])/g, "_$1").toLowerCase()} = $${i + 1}`).join(', ');
      const listingValues = listingFields.map(field => listingDetails[field]);
      const updateListingQuery = `UPDATE listings SET ${setClauses} WHERE id = $${listingFields.length + 1}`;
      await client.query(updateListingQuery, [...listingValues, id]);
    }

    // If features are provided, resync them.
    if (features) {
      await client.query('DELETE FROM listing_features WHERE listing_id = $1', [id]);
      if (features.length > 0) {
        for (const featureId of features) {
          await client.query(
            'INSERT INTO listing_features (listing_id, feature_id) VALUES ($1, $2)',
            [id, featureId]
          );
        }
      }
    }

    await client.query('COMMIT');
    return findByPublicId(publicListingId);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Deletes a listing from the database using its public listing_id.
 * @param {string} publicListingId The public listing_id of the listing to delete.
 * @returns {Promise<number>} A promise that resolves to the number of deleted rows (1 or 0).
 */
const removeByPublicId = async (publicListingId) => {
  // ON DELETE CASCADE in the schema will handle deleting related data automatically.
  // First, get the internal ID from the public listing_id
  const listingResult = await db.query('SELECT id FROM listings WHERE listing_id = $1', [publicListingId]);
  if (listingResult.rows.length === 0) {
    return 0; // Listing not found
  }
  const id = listingResult.rows[0].id;
  const result = await db.query('DELETE FROM listings WHERE id = $1', [id]);
  return result.rowCount;
};

/**
 * Finds listings based on a dynamic set of filters, including full-text search.
 * @param {Object} filters - An object containing filter criteria.
 * @param {string} [filters.searchText] - Text to search for in title and description.
 * @param {number} [filters.locationId] - The ID of the location to filter by.
 * @param {number} [filters.minPrice] - The minimum price.
 * @param {number} [filters.maxPrice] - The maximum price.
 * @returns {Promise<Array>} A promise that resolves to an array of matching listing objects.
 */
const findByFilters = async (filters = {}) => {
  const { searchText, locationId, minPrice, maxPrice } = filters;
  let queryParams = [];
  let whereClauses = [];

  if (searchText) {
    queryParams.push(searchText.split(' ').join(' & '));
    whereClauses.push(`l.search_vector @@ to_tsquery('english', $${queryParams.length})`);
  }

  if (locationId) {
    queryParams.push(locationId);
    whereClauses.push(`l.location_id = $${queryParams.length}`);
  }

  // Note: This assumes a single currency for filtering or requires conversion logic.
  // For simplicity, we filter directly on the stored price.
  if (minPrice) {
    queryParams.push(minPrice);
    whereClauses.push(`l.price >= $${queryParams.length}`);
  }

  if (maxPrice) {
    queryParams.push(maxPrice);
    whereClauses.push(`l.price <= $${queryParams.length}`);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // We reuse the main query structure
  const baseQuery = `
    SELECT l.*, loc.name AS location, lt.name AS listing_type, ot.name AS ownership_type, ls.name AS status, c.code as currency, pu.name as price_unit
           ,
           COALESCE(json_agg(DISTINCT li.*) FILTER (WHERE li.id IS NOT NULL), '[]') AS images,
           COALESCE(json_agg(DISTINCT jsonb_build_object('id', f.id, 'name', f.name, 'category', f.category)) FILTER (WHERE f.id IS NOT NULL), '[]') AS features
    FROM listings l
    LEFT JOIN locations loc ON l.location_id = loc.id LEFT JOIN listing_types lt ON l.listing_type_id = lt.id LEFT JOIN ownership_types ot ON l.ownership_type_id = ot.id LEFT JOIN listing_statuses ls ON l.status_id = ls.id LEFT JOIN price_units pu ON l.price_unit_id = pu.id LEFT JOIN currencies c ON l.currency_id = c.id LEFT JOIN listing_images li ON l.id = li.listing_id LEFT JOIN listing_features lf ON l.id = lf.listing_id LEFT JOIN features f ON lf.feature_id = f.id
    ${whereString}
    GROUP BY l.id, loc.name, lt.name, ot.name, ls.name, c.code, pu.name
    ORDER BY l.created_at DESC;
  `;

  const { rows } = await db.query(baseQuery, queryParams);
  return rows;
};

module.exports = {
  findAll,
  findByPublicId,
  create,
  updateByPublicId,
  removeByPublicId,
  findByFilters,
};