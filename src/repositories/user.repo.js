const pool = require('../db/pool');
const env = require('../config/env');
const bcrypt = require('bcryptjs');

function qualify(table) {
  return `${env.dbSchema}.${table}`;
}

async function createUser({ email, name, password }) {
  const passwordHash = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO ${qualify('users')} (email, name, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, email, name, created_at
  `;

  const result = await pool.query(sql, [email, name, passwordHash]);
  return result.rows[0];
}

async function findByEmail(email) {
  const sql = `
    SELECT id, email, password_hash
    FROM ${env.dbSchema}.users
    WHERE email = $1
    LIMIT 1
  `;
  const result = await pool.query(sql, [email]);
  return result.rows[0] || null;
}

module.exports = { createUser, findByEmail };
