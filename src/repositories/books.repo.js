const pool = require('../db/pool');
const env = require('../config/env');

function qualify(table) {
  return `${env.dbSchema}.${table}`;
}

async function listBooks(limit = 20) {
  const sql = `SELECT id, isbn, title, author, available, created_at
	               FROM ${qualify('books')}
	               ORDER BY id DESC
	               LIMIT $1`;
  const result = await pool.query(sql, [limit]);
  return result.rows;
}

async function getBookById(id) {
  const sql = `SELECT id, isbn, title, author, available, created_at
	               FROM ${qualify('books')}
	               WHERE id = $1`;
  const result = await pool.query(sql, [id]);
  return result.rows[0];
}

async function createBook({ title, author = null }) {
  const sql = `INSERT INTO ${qualify('books')} (title, author)
	               VALUES ($1, $2)
	               RETURNING id, isbn, title, author, available, created_at`;
  const result = await pool.query(sql, [title, author]);
  return result.rows[0];
}

module.exports = { listBooks, createBook, getBookById };
