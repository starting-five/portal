/**
 * Returns the total count of listings matching the given filters.
 */
const countByFilters = async (filters = {}) => {
  const {
    featureIds,
    userId,
    searchText,
    locationId,
    minPrice,
    maxPrice,
    ownershipTypeId,
    listingTypeId,
    listingStatusId,
    bedrooms,
    bathrooms,
  } = filters;
  let queryParams = [];
  let whereClauses = [];

  // Feature filter logic (after queryParams/whereClauses are initialized)
  if (featureIds && Array.isArray(featureIds) && featureIds.length > 0) {
    // Strict match: listing must have ALL requested features
    const placeholders = featureIds
      .map((_, idx) => `$${queryParams.length + idx + 1}`)
      .join(", ");
    queryParams.push(...featureIds);
    whereClauses.push(`id IN (
      SELECT listing_id 
      FROM listing_features 
      WHERE feature_id IN (${placeholders})
      GROUP BY listing_id 
      HAVING COUNT(DISTINCT feature_id) = ${featureIds.length}
    )`);
  } else if (featureIds) {
    queryParams.push(featureIds);
    whereClauses.push(
      `id IN (SELECT listing_id FROM listing_features WHERE feature_id = $${queryParams.length})`
    );
  }

  if (userId) {
    queryParams.push(userId);
    whereClauses.push(`user_id = $${queryParams.length}`);
  }
  if (searchText) {
    queryParams.push(searchText.split(" ").join(" & "));
    whereClauses.push(
      `search_vector @@ to_tsquery('english', $${queryParams.length})`
    );
  }
  if (locationId && Array.isArray(locationId) && locationId.length > 0) {
    const placeholders = locationId
      .map((_, idx) => `$${queryParams.length + idx + 1}`)
      .join(", ");
    queryParams.push(...locationId);
    whereClauses.push(`location_id IN (${placeholders})`);
  } else if (locationId) {
    queryParams.push(locationId);
    whereClauses.push(`location_id = $${queryParams.length}`);
  }
  if (minPrice) {
    queryParams.push(minPrice);
    whereClauses.push(`price >= $${queryParams.length}`);
  }
  if (maxPrice) {
    queryParams.push(maxPrice);
    whereClauses.push(`price <= $${queryParams.length}`);
  }
  if (
    ownershipTypeId &&
    Array.isArray(ownershipTypeId) &&
    ownershipTypeId.length > 0
  ) {
    const placeholders = ownershipTypeId
      .map((_, idx) => `$${queryParams.length + idx + 1}`)
      .join(", ");
    queryParams.push(...ownershipTypeId);
    whereClauses.push(`ownership_type_id IN (${placeholders})`);
  } else if (ownershipTypeId) {
    queryParams.push(ownershipTypeId);
    whereClauses.push(`ownership_type_id = $${queryParams.length}`);
  }
  if (
    listingTypeId &&
    Array.isArray(listingTypeId) &&
    listingTypeId.length > 0
  ) {
    const placeholders = listingTypeId
      .map((_, idx) => `$${queryParams.length + idx + 1}`)
      .join(", ");
    queryParams.push(...listingTypeId);
    whereClauses.push(`listing_type_id IN (${placeholders})`);
  } else if (listingTypeId) {
    queryParams.push(listingTypeId);
    whereClauses.push(`listing_type_id = $${queryParams.length}`);
  }
  if (
    listingStatusId &&
    Array.isArray(listingStatusId) &&
    listingStatusId.length > 0
  ) {
    const placeholders = listingStatusId
      .map((_, idx) => `$${queryParams.length + idx + 1}`)
      .join(", ");
    queryParams.push(...listingStatusId);
    whereClauses.push(`status_id IN (${placeholders})`);
  } else if (listingStatusId) {
    queryParams.push(listingStatusId);
    whereClauses.push(`status_id = $${queryParams.length}`);
  }
  if (bedrooms) {
    queryParams.push(bedrooms);
    whereClauses.push(`bedrooms >= $${queryParams.length}`);
  }
  if (bathrooms) {
    queryParams.push(bathrooms);
    whereClauses.push(`bathrooms >= $${queryParams.length}`);
  }

  const whereString =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const query = `SELECT COUNT(*) FROM listings ${whereString};`;
  const { rows } = await db.query(query, queryParams);
  return parseInt(rows[0].count, 10);
};
const db = require("../db/index.js");

/**
 * Finds all listings and aggregates their related data (prices, images, features).
 * @returns {Promise<Array>} A promise that resolves to an array of listing objects.
 */
const findAll = async () => {
  const query = `
    SELECT
      l.*,
      COALESCE((
        SELECT json_agg(li_sub ORDER BY li_sub.sort_order ASC)
        FROM listing_images li_sub
        WHERE li_sub.listing_id = l.id
      ), '[]') AS images,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', f.id)) FILTER (WHERE f.id IS NOT NULL), '[]') AS features
    FROM listings l
    LEFT JOIN listing_images li ON l.id = li.listing_id
    LEFT JOIN listing_features lf ON l.id = lf.listing_id
    LEFT JOIN features f ON lf.feature_id = f.id
    GROUP BY l.id
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
      l.id,
      l.listing_id,
      l.user_id,
      l.listing_type_id,
      l.ownership_type_id,
      l.location_id,
      l.status_id,
      l.price,
      l.bedrooms,
      l.bathrooms,
      l.land_size_sqm,
      l.building_size_sqm,
      l.year_built,
      l.youtube_url,
      l.kuula_url,
      COALESCE((
        SELECT json_agg(li_sub ORDER BY li_sub.sort_order ASC)
        FROM listing_images li_sub
        WHERE li_sub.listing_id = l.id
      ), '[]') AS images,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', f.id)) FILTER (WHERE f.id IS NOT NULL), '[]') AS features
    FROM listings l
    LEFT JOIN listing_images li ON l.id = li.listing_id
    LEFT JOIN listing_features lf ON l.id = lf.listing_id
    LEFT JOIN features f ON lf.feature_id = f.id
    WHERE l.listing_id = $1
    GROUP BY l.id;
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
  const { features, translations, ...listing } = listingData;
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    // Dynamically build the INSERT query for only provided fields
    const keys = Object.keys(listing).filter(
      (k) => listing[k] !== undefined && listing[k] !== ""
    );
    let columns = keys.map((k) => k.replace(/([A-Z])/g, "_$1").toLowerCase());
    let values = keys.map((k) => listing[k]);
    let placeholders = keys.map((_, i) => `$${i + 1}`);

    // Prepare search_vector from first translation (if available and non-empty)
    let searchVector = null;
    if (translations && translations.length > 0) {
      const t = translations[0];
      const title = t.title ? t.title.trim() : "";
      const description = t.description ? t.description.trim() : "";
      if (title.length > 0 || description.length > 0) {
        searchVector = `${title} ${description}`.trim();
      }
    }
    if (searchVector && searchVector.length > 0) {
      columns.push("search_vector");
      placeholders.push(`$${placeholders.length + 1}`);
      values.push(searchVector);
    }

    // If search_vector is present, wrap its placeholder with to_tsvector('english', $N)
    let sqlColumns = columns.join(", ");
    let sqlPlaceholders = placeholders.join(", ");
    const svIdx = columns.indexOf("search_vector");
    if (svIdx !== -1) {
      // Replace the placeholder for search_vector in the VALUES clause
      let phArr = placeholders.slice();
      phArr[svIdx] = `to_tsvector('english', $${svIdx + 1})`;
      sqlPlaceholders = phArr.join(", ");
    }
    const listingQuery = `
      INSERT INTO listings (${sqlColumns})
      VALUES (${sqlPlaceholders})
      RETURNING id, listing_id;
    `;
    // Uncomment to debug:
    // console.log('SQL:', listingQuery);
    // console.log('Values:', values);
    const listingResult = await client.query(listingQuery, values);
    const { id: newListingId, listing_id: newPublicId } = listingResult.rows[0];

    // Insert translations
    if (translations && Array.isArray(translations)) {
      for (const t of translations) {
        await client.query(
          "INSERT INTO listing_translations (listing_id, language_code, title, description) VALUES ($1, $2, $3, $4)",
          [newListingId, t.language_code, t.title, t.description]
        );
      }
    }

    // Link features
    if (features && features.length > 0) {
      for (const featureId of features) {
        await client.query(
          "INSERT INTO listing_features (listing_id, feature_id) VALUES ($1, $2)",
          [newListingId, featureId]
        );
      }
    }

    await client.query("COMMIT");
    return findByPublicId(newPublicId);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating listing:", error.message, error.stack);
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
  const { features, translations, ...listingDetailsRaw } = listingData;
  // Remove any fields that do not exist in the listings table
  const validListingFields = [
    "location_id",
    "listing_type_id",
    "ownership_type_id",
    "status_id",
    "price",
    "bedrooms",
    "bathrooms",
    "land_size_sqm",
    "building_size_sqm",
    "year_built",
    "youtube_url",
    "kuula_url",
  ];
  // Remove currency_id, price_unit, and any other unsupported fields
  const listingDetails = {};
  for (const key of Object.keys(listingDetailsRaw)) {
    if (validListingFields.includes(key)) {
      listingDetails[key] = listingDetailsRaw[key];
    }
  }
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    // First, get the internal ID from the public listing_id
    const listingResult = await client.query(
      "SELECT id FROM listings WHERE listing_id = $1",
      [publicListingId]
    );
    if (listingResult.rows.length === 0) {
      throw new Error("Listing not found"); // Or handle as appropriate
    }
    const id = listingResult.rows[0].id;

    // Remove any fields that do not exist in the listings table
    const validListingFields = [
      "location_id",
      "listing_type_id",
      "ownership_type_id",
      "status_id",
      "price",
      "bedrooms",
      "bathrooms",
      "land_size_sqm",
      "building_size_sqm",
      "year_built",
      "youtube_url",
      "kuula_url",
    ];
    const updateFields = Object.keys(listingDetails).filter((f) =>
      validListingFields.includes(f)
    );
    if (updateFields.length > 0) {
      let setClauses = updateFields.map(
        (field, i) =>
          `${field.replace(/([A-Z])/g, "_$1").toLowerCase()} = $${i + 1}`
      );
      let listingValues = updateFields.map((field) => listingDetails[field]);

      // Update search_vector if translations are provided
      if (translations && translations.length > 0) {
        const t = translations[0];
        const searchVector = `${t.title || ""} ${t.description || ""}`;
        setClauses.push(
          `search_vector = to_tsvector('english', $${setClauses.length + 1})`
        );
        listingValues.push(searchVector);
      }

      const updateListingQuery = `UPDATE listings SET ${setClauses.join(
        ", "
      )} WHERE id = $${listingValues.length + 1}`;
      await client.query(updateListingQuery, [...listingValues, id]);
    }

    // If features are provided, resync them.
    if (features) {
      await client.query("DELETE FROM listing_features WHERE listing_id = $1", [
        id,
      ]);
      if (features.length > 0) {
        for (const featureId of features) {
          await client.query(
            "INSERT INTO listing_features (listing_id, feature_id) VALUES ($1, $2)",
            [id, featureId]
          );
        }
      }
    }

    // If translations are provided, update them
    if (translations && Array.isArray(translations)) {
      // Remove existing translations for this listing
      await client.query(
        "DELETE FROM listing_translations WHERE listing_id = $1",
        [id]
      );
      // Insert new translations
      for (const t of translations) {
        await client.query(
          "INSERT INTO listing_translations (listing_id, language_code, title, description) VALUES ($1, $2, $3, $4)",
          [id, t.language_code, t.title, t.description]
        );
      }
    }

    await client.query("COMMIT");
    return findByPublicIdWithTranslation(
      publicListingId,
      translations && translations[0] ? translations[0].language_code : "en"
    );
  } catch (error) {
    await client.query("ROLLBACK");
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
  const listingResult = await db.query(
    "SELECT id FROM listings WHERE listing_id = $1",
    [publicListingId]
  );
  if (listingResult.rows.length === 0) {
    return 0; // Listing not found
  }
  const id = listingResult.rows[0].id;
  const result = await db.query("DELETE FROM listings WHERE id = $1", [id]);
  return result.rowCount;
};

/**
 * Finds listings based on a dynamic set of filters, including full-text search.
 * @param {Object} filters - An object containing filter criteria.
 * @param {string} [filters.searchText] - Text to search for in title and description.
 * @param {number|number[]} [filters.locationId] - The ID(s) of the location to filter by.
 * @param {number|number[]} [filters.listingTypeId] - The ID(s) of the listing type to filter by.
 * @param {number|number[]} [filters.ownershipTypeId] - The ID(s) of the ownership type to filter by.
 * @param {number|number[]} [filters.listingStatusId] - The ID(s) of the listing status to filter by (from API param listing_status_id).
 * @param {number} [filters.minPrice] - The minimum price.
 * @param {number} [filters.maxPrice] - The maximum price.
 * @param {number} [filters.bedrooms] - Number of bedrooms.
 * @param {number} [filters.bathrooms] - Number of bathrooms.
 * @returns {Promise<Array>} A promise that resolves to an array of matching listing objects.
 */

const findByFiltersWithTranslations = async (
  filters = {},
  lang = "en",
  limit = null,
  offset = null
) => {
  const {
    featureIds,
    userId,
    searchText,
    locationId,
    minPrice,
    maxPrice,
    ownershipTypeId,
    listingTypeId,
    listingStatusId,
    bedrooms,
    bathrooms,
  } = filters;
  let queryParams = [lang];
  let whereClauses = [];

  // Feature filter logic (after queryParams/whereClauses are initialized)
  if (featureIds && Array.isArray(featureIds) && featureIds.length > 0) {
    // Strict match: listing must have ALL requested features
    const placeholders = featureIds
      .map((_, idx) => `$${queryParams.length + idx + 1}`)
      .join(", ");
    queryParams.push(...featureIds);
    whereClauses.push(`l.id IN (
      SELECT listing_id 
      FROM listing_features 
      WHERE feature_id IN (${placeholders})
      GROUP BY listing_id 
      HAVING COUNT(DISTINCT feature_id) = ${featureIds.length}
    )`);
  } else if (featureIds) {
    queryParams.push(featureIds);
    whereClauses.push(
      `l.id IN (SELECT listing_id FROM listing_features WHERE feature_id = $${queryParams.length})`
    );
  }

  if (userId) {
    queryParams.push(userId);
    whereClauses.push(`l.user_id = $${queryParams.length}`);
  }
  if (searchText) {
    queryParams.push(searchText.split(" ").join(" & "));
    whereClauses.push(
      `l.search_vector @@ to_tsquery('english', $${queryParams.length})`
    );
  }
  if (locationId && Array.isArray(locationId) && locationId.length > 0) {
    const placeholders = locationId
      .map((_, idx) => `$${queryParams.length + idx + 1}`)
      .join(", ");
    queryParams.push(...locationId);
    whereClauses.push(`l.location_id IN (${placeholders})`);
  } else if (locationId) {
    queryParams.push(locationId);
    whereClauses.push(`l.location_id = $${queryParams.length}`);
  }
  if (minPrice) {
    queryParams.push(minPrice);
    whereClauses.push(`l.price >= $${queryParams.length}`);
  }
  if (maxPrice) {
    queryParams.push(maxPrice);
    whereClauses.push(`l.price <= $${queryParams.length}`);
  }
  if (
    ownershipTypeId &&
    Array.isArray(ownershipTypeId) &&
    ownershipTypeId.length > 0
  ) {
    const placeholders = ownershipTypeId
      .map((_, idx) => `$${queryParams.length + idx + 1}`)
      .join(", ");
    queryParams.push(...ownershipTypeId);
    whereClauses.push(`l.ownership_type_id IN (${placeholders})`);
  } else if (ownershipTypeId) {
    queryParams.push(ownershipTypeId);
    whereClauses.push(`l.ownership_type_id = $${queryParams.length}`);
  }
  if (
    listingTypeId &&
    Array.isArray(listingTypeId) &&
    listingTypeId.length > 0
  ) {
    const placeholders = listingTypeId
      .map((_, idx) => `$${queryParams.length + idx + 1}`)
      .join(", ");
    queryParams.push(...listingTypeId);
    whereClauses.push(`l.listing_type_id IN (${placeholders})`);
  } else if (listingTypeId) {
    queryParams.push(listingTypeId);
    whereClauses.push(`l.listing_type_id = $${queryParams.length}`);
  }
  if (
    listingStatusId &&
    Array.isArray(listingStatusId) &&
    listingStatusId.length > 0
  ) {
    const placeholders = listingStatusId
      .map((_, idx) => `$${queryParams.length + idx + 1}`)
      .join(", ");
    queryParams.push(...listingStatusId);
    whereClauses.push(`l.status_id IN (${placeholders})`);
  } else if (listingStatusId) {
    queryParams.push(listingStatusId);
    whereClauses.push(`l.status_id = $${queryParams.length}`);
  }
  if (bedrooms) {
    queryParams.push(bedrooms);
    whereClauses.push(`l.bedrooms >= $${queryParams.length}`);
  }
  if (bathrooms) {
    queryParams.push(bathrooms);
    whereClauses.push(`l.bathrooms >= $${queryParams.length}`);
  }

  const whereString =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  let query = `
    SELECT
      l.*, l.price,
      COALESCE((
        SELECT json_agg(li_sub ORDER BY li_sub.sort_order ASC)
        FROM listing_images li_sub
        WHERE li_sub.listing_id = l.id
      ), '[]') AS images,
      COALESCE(json_agg(DISTINCT f.id) FILTER (WHERE f.id IS NOT NULL), '[]') AS features,
      COALESCE(t.title, NULL) AS title,
      COALESCE(t.description, NULL) AS description
    FROM listings l
    LEFT JOIN listing_types lt ON l.listing_type_id = lt.id
    LEFT JOIN ownership_types ot ON l.ownership_type_id = ot.id
    LEFT JOIN listing_statuses ls ON l.status_id = ls.id
    LEFT JOIN listing_images li ON l.id = li.listing_id
    LEFT JOIN listing_features lf ON l.id = lf.listing_id
    LEFT JOIN features f ON lf.feature_id = f.id
    LEFT JOIN listing_translations t ON l.id = t.listing_id AND t.language_code = $1
    ${whereString}
    GROUP BY l.id, lt.id, ot.id, ls.id, t.title, t.description
    ORDER BY l.created_at DESC
  `;
  let paramOffset = queryParams.length + 1;
  if (limit !== null && offset !== null) {
    query += ` LIMIT $${paramOffset} OFFSET $${paramOffset + 1}`;
    queryParams.push(limit, offset);
  } else if (limit !== null) {
    query += ` LIMIT $${paramOffset}`;
    queryParams.push(limit);
  } else if (offset !== null) {
    query += ` OFFSET $${paramOffset}`;
    queryParams.push(offset);
  } else {
    query += `;`;
  }
  const { rows } = await db.query(query, queryParams);
  return rows;
};

/**
 * Finds all listings and returns translations for the requested language (fallback to English).
 */

const findAllWithTranslations = async (
  lang = "en",
  limit = null,
  offset = null
) => {
  let query = `
    SELECT
      l.*, l.price,
      COALESCE((
        SELECT json_agg(li_sub ORDER BY li_sub.sort_order ASC)
        FROM listing_images li_sub
        WHERE li_sub.listing_id = l.id
      ), '[]') AS images,
      COALESCE(json_agg(DISTINCT f.id) FILTER (WHERE f.id IS NOT NULL), '[]') AS features,
      COALESCE(t.title, NULL) AS title,
      COALESCE(t.description, NULL) AS description
    FROM listings l
    LEFT JOIN listing_types lt ON l.listing_type_id = lt.id
    LEFT JOIN ownership_types ot ON l.ownership_type_id = ot.id
    LEFT JOIN listing_statuses ls ON l.status_id = ls.id
    LEFT JOIN listing_images li ON l.id = li.listing_id
    LEFT JOIN listing_features lf ON l.id = lf.listing_id
    LEFT JOIN features f ON lf.feature_id = f.id
    LEFT JOIN listing_translations t ON l.id = t.listing_id AND t.language_code = $1
    GROUP BY l.id, lt.id, ot.id, ls.id, t.title, t.description
    ORDER BY l.created_at DESC`;
  let params = [lang];
  if (limit !== null && offset !== null) {
    query += ` LIMIT $2 OFFSET $3`;
    params = [lang, limit, offset];
  } else if (limit !== null) {
    query += ` LIMIT $2`;
    params = [lang, limit];
  } else if (offset !== null) {
    query += ` OFFSET $2`;
    params = [lang, offset];
  } else {
    query += `;`;
  }
  const { rows } = await db.query(query, params);
  return rows;
};

/**
 * Finds a single listing by its public listing_id and returns translation for the requested language (fallback to English).
 */

const findByPublicIdWithTranslation = async (listing_id, lang = "en") => {
  // Get the main listing data for the requested language
  const query = `
    SELECT
      l.*, l.price,
      COALESCE((
        SELECT json_agg(li_sub ORDER BY li_sub.sort_order ASC)
        FROM listing_images li_sub
        WHERE li_sub.listing_id = l.id
      ), '[]') AS images,
      COALESCE(json_agg(DISTINCT f.id) FILTER (WHERE f.id IS NOT NULL), '[]') AS features,
      COALESCE(t.title, NULL) AS title,
      COALESCE(t.description, NULL) AS description
    FROM listings l
    LEFT JOIN listing_types lt ON l.listing_type_id = lt.id
    LEFT JOIN ownership_types ot ON l.ownership_type_id = ot.id
    LEFT JOIN listing_statuses ls ON l.status_id = ls.id
    LEFT JOIN listing_images li ON l.id = li.listing_id
    LEFT JOIN listing_features lf ON l.id = lf.listing_id
    LEFT JOIN features f ON lf.feature_id = f.id
    LEFT JOIN listing_translations t ON l.id = t.listing_id AND t.language_code = $2
    WHERE l.listing_id = $1
    GROUP BY l.id, lt.id, ot.id, ls.id, t.title, t.description
    ORDER BY l.created_at DESC;
  `;
  const { rows } = await db.query(query, [listing_id, lang]);
  const listing = rows[0];
  if (!listing) return undefined;

  // Get all translations for this listing
  const translationsQuery = `
    SELECT language_code, title, description
    FROM listing_translations
    WHERE listing_id = (SELECT id FROM listings WHERE listing_id = $1)
    ORDER BY language_code;
  `;
  const { rows: translations } = await db.query(translationsQuery, [
    listing_id,
  ]);
  return {
    ...listing,
    translations,
  };
};

/**
 * Finds all listings for a specific user and returns translations for the requested language.
 */
const findAllByUserWithTranslations = async (
  userId,
  lang = "en",
  limit = null,
  offset = null
) => {
  let query = `
    SELECT
      l.*, l.price,
      COALESCE((
        SELECT json_agg(li_sub ORDER BY li_sub.sort_order ASC)
        FROM listing_images li_sub
        WHERE li_sub.listing_id = l.id
      ), '[]') AS images,
      COALESCE(json_agg(DISTINCT f.id) FILTER (WHERE f.id IS NOT NULL), '[]') AS features,
      COALESCE(t.title, NULL) AS title,
      COALESCE(t.description, NULL) AS description
    FROM listings l
    LEFT JOIN listing_types lt ON l.listing_type_id = lt.id
    LEFT JOIN ownership_types ot ON l.ownership_type_id = ot.id
    LEFT JOIN listing_statuses ls ON l.status_id = ls.id
    LEFT JOIN listing_images li ON l.id = li.listing_id
    LEFT JOIN listing_features lf ON l.id = lf.listing_id
    LEFT JOIN features f ON lf.feature_id = f.id
    LEFT JOIN listing_translations t ON l.id = t.listing_id AND t.language_code = $2
    WHERE l.user_id = $1
    GROUP BY l.id, lt.id, ot.id, ls.id, t.title, t.description
    ORDER BY l.created_at DESC`;
  let params = [userId, lang];
  if (limit !== null && offset !== null) {
    query += ` LIMIT $3 OFFSET $4`;
    params = [userId, lang, limit, offset];
  } else if (limit !== null) {
    query += ` LIMIT $3`;
    params = [userId, lang, limit];
  } else if (offset !== null) {
    query += ` OFFSET $3`;
    params = [userId, lang, offset];
  } else {
    query += `;`;
  }
  const { rows } = await db.query(query, params);
  return rows;
};

/**
 * Returns the total count of all listings.
 */
const countAll = async () => {
  const query = "SELECT COUNT(*) FROM listings;";
  const { rows } = await db.query(query);
  return parseInt(rows[0].count, 10);
};

/**
 * Returns the total count of listings for a specific user.
 */
const countByUser = async (userId) => {
  const query = "SELECT COUNT(*) FROM listings WHERE user_id = $1;";
  const { rows } = await db.query(query, [userId]);
  return parseInt(rows[0].count, 10);
};

module.exports = {
  findAll,
  findByPublicId,
  create,
  updateByPublicId,
  removeByPublicId,
  findAllWithTranslations,
  findByPublicIdWithTranslation,
  findAllByUserWithTranslations,
  findByFiltersWithTranslations,
  countByFilters,
  countAll,
  countByUser,
};
