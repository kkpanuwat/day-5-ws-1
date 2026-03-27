const express = require('express');
const authRequired = require('../middlewares/authRequired');
const borrowsService = require('../services/borrows.service');

const router = express.Router();

router.get('/', authRequired, async (req, res, next) => {
  try {
    const scope = req.query.scope;
    const list = await borrowsService.listBorrows({
      userId: scope === 'all' ? null : Number(req.user.sub),
    });

    res.json({ data: list });
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
});

router.post('/', authRequired, async (req, res, next) => {
  try {
    const requestedUserId = Number(req.body?.userId);
    const bookId = Number(req.body?.bookId);
    const dueDate = req.body?.dueDate;

    const borrow = await borrowsService.borrowBook({
      userId: Number.isFinite(requestedUserId) ? requestedUserId : Number(req.user.sub),
      bookId,
      dueDate,
    });

    res.status(201).json({ data: borrow });
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
});

module.exports = router;
