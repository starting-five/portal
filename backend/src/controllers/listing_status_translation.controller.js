
const db = require('../db');

// Helper: Get translations for all listing statuses as a map { listing_status_id: { lang: name, ... } }
async function getListingStatusTranslationsMap() {
  const result = await db.pool.query('SELECT * FROM listing_statuses_translations');
  const map = {};
  for (const row of result.rows) {
    if (!map[row.listing_status_id]) map[row.listing_status_id] = {};
    map[row.listing_status_id][row.language_code] = row.name;
  }
  return map;
}

// Get all listing status translations
exports.getAllListingStatusTranslations = async (req, res) => {
  try {
    const result = await db.pool.query('SELECT * FROM listing_statuses_translations');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing status translations' });
  }
};

// Get translations for a specific listing status by ID
exports.getListingStatusTranslationsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query(
      'SELECT * FROM listing_statuses_translations WHERE listing_status_id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing status not found or no translations available' });
    }
    // Return as { language_code: name, ... }
    const translations = {};
    for (const row of result.rows) {
      translations[row.language_code] = row.name;
    }
    res.json(translations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing status translations' });
  }
};

// Update translations for a specific listing status
exports.updateListingStatusTranslations = async (req, res) => {
  const { id } = req.params;
  const { translations } = req.body;
  try {
    // Check if listing status exists
    const statusRes = await db.pool.query('SELECT id FROM listing_statuses WHERE id = $1', [id]);
    if (statusRes.rows.length === 0) {
      return res.status(404).json({ error: 'Listing status not found.' });
    }
    // Upsert all provided translations
    if (!Array.isArray(translations) || translations.length === 0) {
      return res.status(400).json({ error: 'Translations array required.' });
    }
    for (const t of translations) {
      if (!t.language_code || !t.name) continue;
      await db.pool.query(
        'INSERT INTO listing_statuses_translations (listing_status_id, language_code, name) VALUES ($1, $2, $3) ON CONFLICT (listing_status_id, language_code) DO UPDATE SET name = EXCLUDED.name',
        [id, t.language_code, t.name]
      );
    }
    // Return all updated translations
    const updatedRes = await db.pool.query('SELECT * FROM listing_statuses_translations WHERE listing_status_id = $1', [id]);
    return res.json(updatedRes.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update listing status translations.' });
  }
};

// Update a single translation for a listing status
exports.updateListingStatusTranslation = async (req, res) => {
  const { id, lang } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  try {
    // Check if listing status exists
    const statusRes = await db.pool.query('SELECT id FROM listing_statuses WHERE id = $1', [id]);
    if (statusRes.rows.length === 0) {
      return res.status(404).json({ error: 'Listing status not found.' });
    }
    // Upsert translation
    await db.pool.query(
      'INSERT INTO listing_statuses_translations (listing_status_id, language_code, name) VALUES ($1, $2, $3) ON CONFLICT (listing_status_id, language_code) DO UPDATE SET name = EXCLUDED.name',
      [id, lang, name]
    );
    // Return updated translation
    const updatedRes = await db.pool.query('SELECT * FROM listing_statuses_translations WHERE listing_status_id = $1 AND language_code = $2', [id, lang]);
    if (updatedRes.rows.length === 0) {
      return res.status(404).json({ error: 'Translation not found.' });
    }
    res.json(updatedRes.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update listing status translation.' });
  }
};

// Create a new listing status with translations
exports.createListingStatusWithTranslations = async (req, res) => {
  const { key, translations } = req.body;
  if (!key || typeof key !== 'string' || !key.trim()) {
    return res.status(400).json({ error: 'Key is required and must be a non-empty string.' });
  }
  if (!Array.isArray(translations) || translations.length === 0) {
    return res.status(400).json({ error: 'Translations array required.' });
  }
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    // Insert new listing status with key
    const statusRes = await client.query('INSERT INTO listing_statuses (key) VALUES ($1) RETURNING id', [key.trim()]);
    const statusId = statusRes.rows[0].id;
    // Insert translations
    for (const t of translations) {
      if (!t.language_code || !t.name) continue;
      await client.query(
        'INSERT INTO listing_statuses_translations (listing_status_id, language_code, name) VALUES ($1, $2, $3)',
        [statusId, t.language_code, t.name]
      );
    }
    await client.query('COMMIT');
    // Return created listing status with translations
    const createdTranslations = await client.query('SELECT * FROM listing_statuses_translations WHERE listing_status_id = $1', [statusId]);
    res.status(201).json({ id: statusId, key: key.trim(), translations: createdTranslations.rows });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to create listing status.' });
  } finally {
    client.release();
  }
};

// Export helper for use in other modules
exports.getListingStatusTranslationsMap = getListingStatusTranslationsMap;

// Helper: Get translations for all listing statuses as a map { listing_status_id: { lang: name, ... } }
async function getListingStatusTranslationsMap() {
  const result = await db.pool.query('SELECT * FROM listing_statuses_translations');
  const map = {};
  for (const row of result.rows) {
    if (!map[row.listing_status_id]) map[row.listing_status_id] = {};
    map[row.listing_status_id][row.language_code] = row.name;
  }
  return map;
}

// Get all listing status translations
exports.getAllListingStatusTranslations = async (req, res) => {
  try {
    const result = await db.pool.query('SELECT * FROM listing_statuses_translations');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing status translations' });
  }
};

// Get translations for a specific listing status by ID
exports.getListingStatusTranslationsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query(
      'SELECT * FROM listing_statuses_translations WHERE listing_status_id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing status not found or no translations available' });
    }
    // Return as { language_code: name, ... }
    const translations = {};
    for (const row of result.rows) {
      translations[row.language_code] = row.name;
    }
    res.json(translations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing status translations' });
  }
};

// Update translations for a specific listing status
exports.updateListingStatusTranslations = async (req, res) => {
  const { id } = req.params;
  const { translations } = req.body;
  const { language } = req.query;
  try {
    // Check if listing status exists
    const statusRes = await db.pool.query('SELECT id FROM listing_statuses WHERE id = $1', [id]);
    if (statusRes.rows.length === 0) {
      return res.status(404).json({ error: 'Listing status not found.' });
    }
    if (language) {
      // Only update translation for the specified language
      const translation = Array.isArray(translations)
        ? translations.find(t => t.language_code === language)
        : translations;
      if (!translation || !translation.name) {
        return res.status(400).json({ error: 'Translation for specified language required.' });
      }
      await db.pool.query(
        'INSERT INTO listing_statuses_translations (listing_status_id, language_code, name) VALUES ($1, $2, $3) ON CONFLICT (listing_status_id, language_code) DO UPDATE SET name = EXCLUDED.name',
        [id, language, translation.name]
      );
      // Return updated translation for this language
      const updatedRes = await db.pool.query('SELECT * FROM listing_statuses_translations WHERE listing_status_id = $1 AND language_code = $2', [id, language]);
      return res.json(updatedRes.rows);
    } else {
      // Upsert all provided translations
      if (!Array.isArray(translations) || translations.length === 0) {
        return res.status(400).json({ error: 'Translations array required.' });
      }
      for (const t of translations) {
        if (!t.language_code || !t.name) continue;
        await db.pool.query(
          'INSERT INTO listing_statuses_translations (listing_status_id, language_code, name) VALUES ($1, $2, $3) ON CONFLICT (listing_status_id, language_code) DO UPDATE SET name = EXCLUDED.name',
          [id, t.language_code, t.name]
        );
      }
      // Return all updated translations
      const updatedRes = await db.pool.query('SELECT * FROM listing_statuses_translations WHERE listing_status_id = $1', [id]);
      return res.json(updatedRes.rows);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update listing status translations.' });
  }
};

// Update a single translation for a listing status
exports.updateListingStatusTranslation = async (req, res) => {
  const { id, lang } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  try {
    // Check if listing status exists
    const statusRes = await db.pool.query('SELECT id FROM listing_statuses WHERE id = $1', [id]);
    if (statusRes.rows.length === 0) {
      return res.status(404).json({ error: 'Listing status not found.' });
    }
    // Upsert translation
    await db.pool.query(
      'INSERT INTO listing_statuses_translations (listing_status_id, language_code, name) VALUES ($1, $2, $3) ON CONFLICT (listing_status_id, language_code) DO UPDATE SET name = EXCLUDED.name',
      [id, lang, name]
    );
    // Return updated translation
    const updatedRes = await db.pool.query('SELECT * FROM listing_statuses_translations WHERE listing_status_id = $1 AND language_code = $2', [id, lang]);
    if (updatedRes.rows.length === 0) {
      return res.status(404).json({ error: 'Translation not found.' });
    }
    res.json(updatedRes.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update listing status translation.' });
  }
};

// Create a new listing status with translations
exports.createListingStatusWithTranslations = async (req, res) => {
  const { key, translations } = req.body;
  if (!key || typeof key !== 'string' || !key.trim()) {
    return res.status(400).json({ error: 'Key is required and must be a non-empty string.' });
  }
  if (!Array.isArray(translations) || translations.length === 0) {
    return res.status(400).json({ error: 'Translations array required.' });
  }
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    // Insert new listing status with key
    const statusRes = await client.query('INSERT INTO listing_statuses (key) VALUES ($1) RETURNING id', [key.trim()]);
    const statusId = statusRes.rows[0].id;
    // Insert translations
    for (const t of translations) {
      if (!t.language_code || !t.name) continue;
      await client.query(
        'INSERT INTO listing_statuses_translations (listing_status_id, language_code, name) VALUES ($1, $2, $3)',
        [statusId, t.language_code, t.name]
      );
    }
    await client.query('COMMIT');
    // Return created listing status with translations
    const createdTranslations = await client.query('SELECT * FROM listing_statuses_translations WHERE listing_status_id = $1', [statusId]);
    res.status(201).json({ id: statusId, key: key.trim(), translations: createdTranslations.rows });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to create listing status.' });
  } finally {
    client.release();
  }
};

// Export helper for use in other modules
exports.getListingStatusTranslationsMap = getListingStatusTranslationsMap;
