const express = require('express');
const authRequired = require('../middlewares/authRequired');
const returnsService = require('../services/returns.service');

const router = express.Router();

router.post('/:borrowId', authRequired, async (req, res, next) => {
  try {
    const borrowId = Number(req.params.borrowId);
    const returned = await returnsService.returnBook({
      userId: Number(req.user.sub),
      borrowId,
    });
    res.json({ data: returned });
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
});

module.exports = router;