const express = require('express');
const { Pool } = require('pg');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

const pool = new Pool({
  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:     process.env.DB_PORT,
});

// GET — всі коментарі до поста
router.get('/', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT comments.*, users.email 
       FROM comments 
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = $1
       ORDER BY comments.created_at DESC`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST — додати коментар
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "text обов'язковий" });
    }

    const result = await pool.query(
      'INSERT INTO comments (text, user_id, post_id) VALUES ($1, $2, $3) RETURNING *',
      [text, req.user.id, id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;