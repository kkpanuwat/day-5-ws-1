const pool = require('../db/pool');
const env = require('../config/env');

function qualify(table) {
  return `${env.dbSchema}.${table}`;
}

async function listBooks(limit = 20, search = null) {
  let sql = `SELECT id, isbn, title, author, category, available, created_at FROM ${qualify('books')}`;
  const params = [];
  if (search) {
    sql += ` WHERE title ILIKE \$1 OR author ILIKE \$1`;
    params.push(`%\${search}%`);
    params.push(limit);
    sql += ` ORDER BY id DESC LIMIT \$2`;
  } else {
    params.push(limit);
    sql += ` ORDER BY id DESC LIMIT \$1`;
  }
  const result = await pool.query(sql, params);
  return result.rows;
}

async function getBookById(id) {
  const sql = `SELECT id, isbn, title, author, category, available, created_at FROM ${qualify('books')} WHERE id = \$1`;
  const result = await pool.query(sql, [id]);
  return result.rows[0];
}

async function createBook({ title, author = null, category = null, isbn = null }) {
  const sql = `INSERT INTO ${qualify('books')} (title, author, category, isbn) VALUES (\$1, \$2, \$3, \$4) RETURNING id, isbn, title, author, category, available, created_at`;
  const result = await pool.query(sql, [title, author, category, isbn]);
  return result.rows[0];
}

async function updateBook(id, { title, author = null, category = null, isbn = null }) {
  const sql = `UPDATE ${qualify('books')}
               SET title = \$2,
                   author = \$3,
                   category = \$4,
                   isbn = \$5
               WHERE id = \$1
               RETURNING id, isbn, title, author, category, available, created_at`;
  const result = await pool.query(sql, [id, title, author, category, isbn]);
  return result.rows[0];
}

module.exports = { listBooks, createBook, getBookById, updateBook };
