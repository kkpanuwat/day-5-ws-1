CREATE DATABASE kku_library
  WITH
  ENCODING = 'UTF8';

CREATE SCHEMA IF NOT EXISTS app;

CREATE TABLE IF NOT EXISTS app.users (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'User',
  status       TEXT NOT NULL DEFAULT 'active',
  password_hash TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app.books (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  isbn         TEXT UNIQUE,
  title        TEXT NOT NULL,
  author       TEXT,
  category     TEXT,
  available    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app.borrows (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES app.users(id),
  book_id      BIGINT NOT NULL REFERENCES app.books(id),
  borrowed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date     DATE NOT NULL,
  returned_at  TIMESTAMPTZ
);

INSERT INTO app.users (email, name, role, status, password_hash)
VALUES ('alice@example.com', 'Alice', 'User', 'Active', '$2a$10$abcdefghijklmnopqrstuv123456789012345678901234')
RETURNING id, email, created_at;

INSERT INTO app.books (isbn, title, author, category)
VALUES
  ('9780131103627', 'The C Programming Language', 'Kernighan & Ritchie', 'Computer Science'),
  ('9780201633610', 'Design Patterns', 'Gamma et al.', 'Computer Science')
RETURNING id, title;
