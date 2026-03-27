const express = require('express');
const booksRepo = require('../repositories/books.repo');

const router = express.Router();

router.get('/', async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(100, limit)) : 20;

  const books = await booksRepo.listBooks(safeLimit);
  res.json({ data: books });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const book = await booksRepo.getBookById(Number(id));
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json({ data: book });
});

router.post('/', async (req, res) => {
  const { title, author, category, isbn } = req.body ?? {};

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }

  const safeAuthor =
    typeof author === 'string' && author.trim() ? author.trim() : null;
  const safeCategory =
    typeof category === 'string' && category.trim() ? category.trim() : null;
  const safeIsbn =
    typeof isbn === 'string' && isbn.trim() ? isbn.trim() : null;

  const created = await booksRepo.createBook({
    title: title.trim(),
    author: safeAuthor,
    category: safeCategory,
    isbn: safeIsbn,
  });
  return res.status(201).json({ data: created });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, category, isbn } = req.body ?? {};

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }

  const safeAuthor =
    typeof author === 'string' && author.trim() ? author.trim() : null;
  const safeCategory =
    typeof category === 'string' && category.trim() ? category.trim() : null;
  const safeIsbn =
    typeof isbn === 'string' && isbn.trim() ? isbn.trim() : null;

  const updated = await booksRepo.updateBook(Number(id), {
    title: title.trim(),
    author: safeAuthor,
    category: safeCategory,
    isbn: safeIsbn,
  });

  if (!updated) {
    return res.status(404).json({ error: 'Book not found' });
  }

  return res.json({ data: updated });
});

module.exports = router;
