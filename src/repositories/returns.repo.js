const pool = require('../db/pool');
const env = require('../config/env');

function qualify(table) {
  return `${env.dbSchema}.${table}`;
}

async function getBorrowById(borrowId) {
  const sql = `
    SELECT id, user_id, book_id, returned_at
    FROM ${qualify('borrows')}
    WHERE id = $1
    LIMIT 1
  `;
  const result = await pool.query(sql, [borrowId]);
  return result.rows[0] || null;
}

async function returnBorrow({ borrowId, userId }) {
  const sql = `
    WITH updated AS (
      UPDATE ${qualify('borrows')}
      SET returned_at = now()
      WHERE id = $1 AND user_id = $2 AND returned_at IS NULL
      RETURNING id, user_id, book_id, borrowed_at, due_date, returned_at
    ), book AS (
      UPDATE ${qualify('books')}
      SET available = true
      WHERE id = (SELECT book_id FROM updated)
    )
    SELECT *
    FROM updated
  `;
  const result = await pool.query(sql, [borrowId, userId]);
  return result.rows[0] || null;
}

module.exports = { getBorrowById, returnBorrow };