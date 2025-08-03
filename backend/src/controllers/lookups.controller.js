const db = require("../db");

// Helper to format translations into { en: '...', id: '...', es: '...' }
function formatLabels(translations) {
  return translations.reduce((acc, t) => {
    acc[t.language_code] = t.name;
    return acc;
  }, {});
}

exports.getAllLookups = async (req, res) => {
  try {
    // Listing Types
    const listingTypesRes = await db.pool.query(`
      SELECT lt.id, lt.key, lt.sort_order, ltt.language_code, ltt.name
      FROM listing_types lt
      JOIN listing_type_translations ltt ON lt.id = ltt.listing_type_id
      ORDER BY lt.sort_order, lt.id
    `);
    const listingTypesMap = {};
    listingTypesRes.rows.forEach((row) => {
      if (!listingTypesMap[row.id]) {
        listingTypesMap[row.id] = {
          id: row.id,
          key: row.key,
          sort_order: row.sort_order,
          labels: {},
        };
      }
      listingTypesMap[row.id].labels[row.language_code] = row.name;
    });
    const listing_types = Object.values(listingTypesMap);

    // Ownership Types
    const ownershipTypesRes = await db.pool.query(`
      SELECT ot.id, ot.key, ot.sort_order, ott.language_code, ott.name
      FROM ownership_types ot
      JOIN ownership_type_translations ott ON ot.id = ott.ownership_type_id
      ORDER BY ot.sort_order, ot.id
    `);
    const ownershipTypesMap = {};
    ownershipTypesRes.rows.forEach((row) => {
      if (!ownershipTypesMap[row.id]) {
        ownershipTypesMap[row.id] = {
          id: row.id,
          key: row.key,
          sort_order: row.sort_order,
          labels: {},
        };
      }
      ownershipTypesMap[row.id].labels[row.language_code] = row.name;
    });
    const ownership_types = Object.values(ownershipTypesMap);

    // Listing Statuses
    const listingStatusesRes = await db.pool.query(`
      SELECT ls.id, ls.key, ls.sort_order, lst.language_code, lst.name
      FROM listing_statuses ls
      JOIN listing_statuses_translations lst ON ls.id = lst.listing_status_id
      ORDER BY ls.sort_order, ls.id
    `);
    const listingStatusesMap = {};
    listingStatusesRes.rows.forEach((row) => {
      if (!listingStatusesMap[row.id]) {
        listingStatusesMap[row.id] = {
          id: row.id,
          key: row.key,
          sort_order: row.sort_order,
          labels: {},
        };
      }
      listingStatusesMap[row.id].labels[row.language_code] = row.name;
    });
    const listing_statuses = Object.values(listingStatusesMap);

    // Feature Categories
    const featureCategoriesRes = await db.pool.query(`
      SELECT fc.key, fc.sort_order, fct.language_code, fct.name
      FROM feature_categories fc
      JOIN feature_categories_translations fct ON fc.key = fct.category_key
      ORDER BY fc.sort_order
    `);
    const featureCategoriesMap = {};
    featureCategoriesRes.rows.forEach((row) => {
      if (!featureCategoriesMap[row.key]) {
        featureCategoriesMap[row.key] = {
          key: row.key,
          sort_order: row.sort_order,
          labels: {},
        };
      }
      featureCategoriesMap[row.key].labels[row.language_code] = row.name;
    });
    const feature_categories = Object.values(featureCategoriesMap);

    // Features
    const featuresRes = await db.pool.query(`
      SELECT f.id, f.key, f.category_key, f.sort_order, ft.language_code, ft.name
      FROM features f
      JOIN features_translations ft ON f.id = ft.feature_id
      ORDER BY f.category_key, f.sort_order, f.id
    `);
    const featuresMap = {};
    featuresRes.rows.forEach((row) => {
      if (!featuresMap[row.id]) {
        featuresMap[row.id] = {
          id: row.id,
          key: row.key,
          category_key: row.category_key,
          sort_order: row.sort_order,
          labels: {},
        };
      }
      featuresMap[row.id].labels[row.language_code] = row.name;
    });
    const featuresFlat = Object.values(featuresMap);

    // Locations (no translations)
    const locationsRes = await db.pool.query(`
      SELECT id, name, sort_order
      FROM locations
      ORDER BY sort_order, id
    `);
    const locations = locationsRes.rows.map((row) => ({
      id: row.id,
      name: row.name,
      sort_order: row.sort_order,
    }));

    // Build features: array of categories, each with its children features
    const features = feature_categories.map((category) => ({
      ...category,
      items: featuresFlat.filter((f) => f.category_key === category.key),
    }));

    res.json({
      listing_types,
      ownership_types,
      listing_statuses,
      features,
      locations,
    });
  } catch (err) {
    console.error("Error fetching lookups:", err);
    res.status(500).json({ error: "Failed to fetch lookups" });
  }
};
