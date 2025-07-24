const db = require('../db');

// Helper: Get translations for all ownership types as a map { ownership_type_id: { lang: name, ... } }
async function getOwnershipTypeTranslationsMap() {
  const result = await db.pool.query('SELECT * FROM ownership_type_translations');
  const map = {};
  for (const row of result.rows) {
    if (!map[row.ownership_type_id]) map[row.ownership_type_id] = {};
    map[row.ownership_type_id][row.language_code] = row.name;
  }
  return map;
}

// Get all ownership type translations
exports.getAllOwnershipTypeTranslations = async (req, res) => {
  try {
    const result = await db.pool.query('SELECT * FROM ownership_type_translations');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ownership type translations' });
  }
};

// Get translations for a specific ownership type by ID
exports.getOwnershipTypeTranslationsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query(
      'SELECT * FROM ownership_type_translations WHERE ownership_type_id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ownership type not found or no translations available' });
    }
    // Return as { language_code: name, ... }
    const translations = {};
    for (const row of result.rows) {
      translations[row.language_code] = row.name;
    }
    res.json(translations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ownership type translations' });
  }
};

// Update translations for a specific ownership type
exports.updateOwnershipTypeTranslations = async (req, res) => {
  const { id } = req.params;
  const { translations } = req.body;
  const { language } = req.query;
  try {
    // Check if ownership type exists
    const typeRes = await db.pool.query('SELECT id FROM ownership_types WHERE id = $1', [id]);
    if (typeRes.rows.length === 0) {
      return res.status(404).json({ error: 'Ownership type not found.' });
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
        'INSERT INTO ownership_type_translations (ownership_type_id, language_code, name) VALUES ($1, $2, $3) ON CONFLICT (ownership_type_id, language_code) DO UPDATE SET name = EXCLUDED.name',
        [id, language, translation.name]
      );
      // Return updated translation for this language
      const updatedRes = await db.pool.query('SELECT * FROM ownership_type_translations WHERE ownership_type_id = $1 AND language_code = $2', [id, language]);
      return res.json(updatedRes.rows);
    } else {
      // Upsert all provided translations
      if (!Array.isArray(translations) || translations.length === 0) {
        return res.status(400).json({ error: 'Translations array required.' });
      }
      for (const t of translations) {
        if (!t.language_code || !t.name) continue;
        await db.pool.query(
          'INSERT INTO ownership_type_translations (ownership_type_id, language_code, name) VALUES ($1, $2, $3) ON CONFLICT (ownership_type_id, language_code) DO UPDATE SET name = EXCLUDED.name',
          [id, t.language_code, t.name]
        );
      }
      // Return all updated translations
      const updatedRes = await db.pool.query('SELECT * FROM ownership_type_translations WHERE ownership_type_id = $1', [id]);
      return res.json(updatedRes.rows);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ownership type translations.' });
  }
};

// Update a single translation for an ownership type
exports.updateOwnershipTypeTranslation = async (req, res) => {
  const { id, lang } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  try {
    // Check if ownership type exists
    const typeRes = await db.pool.query('SELECT id FROM ownership_types WHERE id = $1', [id]);
    if (typeRes.rows.length === 0) {
      return res.status(404).json({ error: 'Ownership type not found.' });
    }
    // Upsert translation
    await db.pool.query(
      'INSERT INTO ownership_type_translations (ownership_type_id, language_code, name) VALUES ($1, $2, $3) ON CONFLICT (ownership_type_id, language_code) DO UPDATE SET name = EXCLUDED.name',
      [id, lang, name]
    );
    // Return updated translation
    const updatedRes = await db.pool.query('SELECT * FROM ownership_type_translations WHERE ownership_type_id = $1 AND language_code = $2', [id, lang]);
    if (updatedRes.rows.length === 0) {
      return res.status(404).json({ error: 'Translation not found.' });
    }
    res.json(updatedRes.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ownership type translation.' });
  }
};

// Create a new ownership type with translations
exports.createOwnershipTypeWithTranslations = async (req, res) => {
  const { translations } = req.body;
  if (!Array.isArray(translations) || translations.length === 0) {
    return res.status(400).json({ error: 'Translations array required.' });
  }
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    // Insert new ownership type (ID only)
    const typeRes = await client.query('INSERT INTO ownership_types DEFAULT VALUES RETURNING id');
    const typeId = typeRes.rows[0].id;
    // Insert translations
    for (const t of translations) {
      if (!t.language_code || !t.name) continue;
      await client.query(
        'INSERT INTO ownership_type_translations (ownership_type_id, language_code, name) VALUES ($1, $2, $3)',
        [typeId, t.language_code, t.name]
      );
    }
    await client.query('COMMIT');
    // Return created ownership type with translations
    const createdTranslations = await client.query('SELECT * FROM ownership_type_translations WHERE ownership_type_id = $1', [typeId]);
    res.status(201).json({ id: typeId, translations: createdTranslations.rows });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to create ownership type.' });
  } finally {
    client.release();
  }
};

// Export helper for use in other modules
exports.getOwnershipTypeTranslationsMap = getOwnershipTypeTranslationsMap;
