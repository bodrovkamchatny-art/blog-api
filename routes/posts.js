const express = require('express');
const { Pool } = require('pg');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const pool = new Pool({
  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:     process.env.DB_PORT,
});

// GET — всі пости
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT posts.*, users.email FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET — один пост
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT posts.*, users.email FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Не знайдено" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST — створити пост (тільки авторизовані)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "title і content обов'язкові" });
    }

    const result = await pool.query(
      'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE — видалити пост
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ message: "Немає доступу" });
    }
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.json({ message: "Видалено" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;