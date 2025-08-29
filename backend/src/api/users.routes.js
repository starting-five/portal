const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireUser } = require('../middleware/auth');

// GET /api/users/:id - Get user info
router.get('/:id', requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    // Only allow users to fetch their own info
    if (id !== req.user.id) {
      return res.status(403).json({ error: 'You can only access your own account.' });
    }
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users - Create a user in the local users table after Supabase Auth sign-up
router.post('/', requireUser, async (req, res) => {
  try {
    const { id, email, name, role, phone, avatar_url } = req.body;
    if (!id || !email) {
      return res.status(400).json({ error: 'id and email are required' });
    }
    // Insert user if not exists
    const result = await db.query(
      `INSERT INTO users (id, email, name, role, phone, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO NOTHING
       RETURNING *`,
      [id, email, name || null, role || 'user', phone || null, avatar_url || null]
    );
    return res.status(201).json(result.rows[0] || { id, email, name, role, phone, avatar_url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// PUT /api/users/:id - Update user info
router.put('/:id', requireUser, async (req, res) => {
  try {
    const { id } = req.params;
  const { name, phone, avatar_url, watermark_url } = req.body;
    // Only allow users to update their own info
    if (id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own account.' });
    }
    // Build update query dynamically
    const fields = [];
    const values = [];
    if (name !== undefined) {
      fields.push('name = $' + (fields.length + 1));
      values.push(name);
    }
    if (phone !== undefined) {
      fields.push('phone = $' + (fields.length + 1));
      values.push(phone);
    }
    if (avatar_url !== undefined) {
      fields.push('avatar_url = $' + (fields.length + 1));
      values.push(avatar_url);
    }
    if (watermark_url !== undefined) {
      fields.push('watermark_url = $' + (fields.length + 1));
      values.push(watermark_url);
    }
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }
    // Update user in DB
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`;
    values.push(id);
    const result = await db.query(query, values);
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
