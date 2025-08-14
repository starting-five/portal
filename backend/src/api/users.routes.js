const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireUser } = require('../middleware/auth');

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

module.exports = router;
