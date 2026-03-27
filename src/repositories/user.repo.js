const pool = require('../db/pool');
const env = require('../config/env');
const bcrypt = require('bcryptjs');

function qualify(table) {
  return `${env.dbSchema}.${table}`;
}

async function createUser({ email, name, password, role = 'User', status = 'Active' }) {
  const passwordHash = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO ${qualify('users')} (email, name, role, status, password_hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, name, role, status, created_at
  `;

  const result = await pool.query(sql, [email, name, role, status, passwordHash]);
  return result.rows[0];
}

async function findByEmail(email) {
  const sql = `
    SELECT id, email, name, role, status, password_hash
    FROM ${env.dbSchema}.users
    WHERE email = $1
    LIMIT 1
  `;
  const result = await pool.query(sql, [email]);
  return result.rows[0] || null;
}

async function listUsers(limit = 50) {
  const sql = `
    SELECT id, email, name, role, status, created_at
    FROM ${qualify('users')}
    ORDER BY id DESC
    LIMIT $1
  `;
  const result = await pool.query(sql, [limit]);
  return result.rows;
}

async function getUserById(id) {
  const sql = `
    SELECT id, email, name, role, status, created_at
    FROM ${qualify('users')}
    WHERE id = $1
    LIMIT 1
  `;
  const result = await pool.query(sql, [id]);
  return result.rows[0] || null;
}

async function updateUser(id, { email, name, role = 'User', status = 'Active' }) {
  const sql = `
    UPDATE ${qualify('users')}
    SET email = $2,
        name = $3,
        role = $4,
        status = $5
    WHERE id = $1
    RETURNING id, email, name, role, status, created_at
  `;
  const result = await pool.query(sql, [id, email, name, role, status]);
  return result.rows[0] || null;
}

module.exports = { createUser, findByEmail, listUsers, getUserById, updateUser };
