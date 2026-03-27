const pool = require('../db/pool');
const env = require('../config/env');

function qualify(table) {
  return `${env.dbSchema}.${table}`;
}

async function getDashboardStats() {
  const sql = `
    SELECT
      (SELECT COUNT(*)::int FROM ${qualify('books')}) AS total_books,
      (SELECT COUNT(*)::int FROM ${qualify('books')} WHERE available = true) AS available_books,
      (SELECT COUNT(*)::int FROM ${qualify('books')} WHERE available = false) AS borrowed_books,
      (SELECT COUNT(*)::int FROM ${qualify('users')}) AS users_count,
      (
        SELECT COUNT(*)::int
        FROM ${qualify('borrows')}
        WHERE returned_at IS NULL AND due_date < CURRENT_DATE
      ) AS overdue_count
  `;
  const result = await pool.query(sql);
  return result.rows[0] || null;
}

async function listRecentBorrows(limit = 5) {
  const sql = `
    SELECT
      bo.id,
      bo.user_id,
      u.name AS user_name,
      bo.book_id,
      b.title AS book_title,
      bo.borrowed_at,
      bo.due_date,
      bo.returned_at
    FROM ${qualify('borrows')} bo
    JOIN ${qualify('users')} u ON u.id = bo.user_id
    JOIN ${qualify('books')} b ON b.id = bo.book_id
    ORDER BY bo.borrowed_at DESC
    LIMIT $1
  `;
  const result = await pool.query(sql, [limit]);
  return result.rows;
}

module.exports = { getDashboardStats, listRecentBorrows };
