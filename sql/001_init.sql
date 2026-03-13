CREATE DATABASE kku_library
  WITH
  ENCODING = 'UTF8';

CREATE SCHEMA IF NOT EXISTS app;

CREATE TABLE IF NOT EXISTS app.users (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'active',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app.books (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  isbn         TEXT UNIQUE,
  title        TEXT NOT NULL,
  author       TEXT,
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

INSERT INTO app.users (email, name)
VALUES ('alice@example.com', 'Alice')
RETURNING id, email, created_at;

INSERT INTO app.books (isbn, title, author)
VALUES
  ('9780131103627', 'The C Programming Language', 'Kernighan & Ritchie'),
  ('9780201633610', 'Design Patterns', 'Gamma et al.')
RETURNING id, title;

