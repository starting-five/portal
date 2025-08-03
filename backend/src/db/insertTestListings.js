// Script to insert test listings into the database
// Usage: node insertTestListings.js (or via npm run db:insertTestData)

const { pool } = require('./index');
const listingsData = require('./listingsData');

const insertTestListings = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch canonical data for lookups
    const locationsRes = await client.query('SELECT id, name FROM locations');
    const listingTypesRes = await client.query('SELECT id, key FROM listing_types');
    const ownershipTypesRes = await client.query('SELECT id, key FROM ownership_types');
    const statusesRes = await client.query('SELECT id, key FROM listing_statuses');
    const featuresRes = await client.query('SELECT id, key FROM features');

    const locationsMap = Object.fromEntries(locationsRes.rows.map(l => [l.name, l.id]));
    const listingTypesMap = Object.fromEntries(listingTypesRes.rows.map(t => [t.key, t.id]));
    const ownershipTypesMap = Object.fromEntries(ownershipTypesRes.rows.map(t => [t.key, t.id]));
    const statusesMap = Object.fromEntries(statusesRes.rows.map(s => [s.key, s.id]));
    const featuresMap = Object.fromEntries(featuresRes.rows.map(f => [f.key, f.id]));

    // Validate locations
    for (const data of listingsData) {
      if (!locationsMap[data.listing.location]) {
        throw new Error(`Listing location '${data.listing.location}' is not in locations table. Please update locations or fix the listing.`);
      }
    }

    // Insert listings
    for (const data of listingsData) {
      const locationId = locationsMap[data.listing.location];
      const listingTypeId = listingTypesMap[data.listing.listing_type];
      const ownershipTypeId = ownershipTypesMap[data.listing.ownership_type];
      const statusId = statusesMap[data.listing.status];
      if (!ownershipTypeId) {
        throw new Error(`Invalid ownership_type: ${data.listing.ownership_type} in listing for ${data.listing.location}`);
      }
      const listingQuery = `
        INSERT INTO listings (listing_type_id, ownership_type_id, location_id, bedrooms, bathrooms, land_size_sqm, building_size_sqm, status_id, price, year_built)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id;
      `;
      const listingValues = [
        listingTypeId, ownershipTypeId, locationId,
        data.listing.bedrooms, data.listing.bathrooms, data.listing.land_size_sqm,
        data.listing.building_size_sqm, statusId, data.listing.price, data.listing.year_built
      ];
      const listingResult = await client.query(listingQuery, listingValues);
      const newListingId = listingResult.rows[0].id;
      console.log(` -> Created listing with internal ID: ${newListingId}`);

      // Insert translations
      for (const t of data.translations || []) {
        await client.query(
          'INSERT INTO listing_translations (listing_id, language_code, title, description) VALUES ($1, $2, $3, $4)',
          [newListingId, t.language_code, t.title, t.description]
        );
      }

      // Insert images
      for (const image of data.images) {
        await client.query(
          'INSERT INTO listing_images (listing_id, url, alt_text) VALUES ($1, $2, $3)',
          [newListingId, image.url, image.alt_text]
        );
      }

      // Link features
      for (const featureName of data.features) {
        const featureId = featuresMap[featureName];
        if (featureId) {
          await client.query(
            'INSERT INTO listing_features (listing_id, feature_id) VALUES ($1, $2)',
            [newListingId, featureId]
          );
        }
      }
    }

    await client.query('COMMIT');
    console.log('✅ Test listings inserted!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting test listings:', err.stack);
  } finally {
    client.release();
    await pool.end();
  }
};

insertTestListings();
