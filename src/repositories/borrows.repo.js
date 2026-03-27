const pool = require('../db/pool');
const env = require('../config/env');

function qualify(table) {
  return `${env.dbSchema}.${table}`;
}

async function bookExists(bookId) {
  const sql = `SELECT 1 AS ok FROM ${qualify('books')} WHERE id = $1`;
  const result = await pool.query(sql, [bookId]);
  return result.rowCount > 0;
}

async function listBorrows({ userId = null } = {}) {
  const values = [];
  let whereClause = '';

  if (Number.isFinite(userId)) {
    values.push(userId);
    whereClause = 'WHERE bo.user_id = $1';
  }

  const sql = `
    SELECT
      bo.id,
      bo.user_id,
      u.name AS user_name,
      u.email AS user_email,
      bo.book_id,
      bo.borrowed_at,
      bo.due_date,
      bo.returned_at,
      b.title,
      b.title AS book_title,
      b.author,
      b.isbn
    FROM ${qualify('borrows')} bo
    JOIN ${qualify('users')} u ON u.id = bo.user_id
    JOIN ${qualify('books')} b ON b.id = bo.book_id
    ${whereClause}
    ORDER BY bo.borrowed_at DESC
  `;
  const result = await pool.query(sql, values);
  return result.rows;
}

async function borrowBook({ userId, bookId, dueDate }) {
  const sql = `
    WITH claimed AS (
      UPDATE ${qualify('books')}
      SET available = false
      WHERE id = $1 AND available = true
      RETURNING id
    ), inserted AS (
      INSERT INTO ${qualify('borrows')} (user_id, book_id, due_date)
      SELECT $2, id, $3
      FROM claimed
      RETURNING id, user_id, book_id, borrowed_at, due_date, returned_at
    )
    SELECT *
    FROM inserted
  `;
  const result = await pool.query(sql, [bookId, userId, dueDate]);
  return result.rows[0] || null;
}

module.exports = { bookExists, listBorrows, borrowBook };
