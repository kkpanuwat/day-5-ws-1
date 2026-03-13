const express = require('express');
const validateCreateUser = require('../middlewares/validateCreateUser');
const { createUser } = require('../repositories/user.repo');

const router = express.Router();

router.post('/', validateCreateUser, async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const name = req.body.name.trim();
    const password = req.body.password;

    const user = await createUser({ email, name, password });

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
    });
  } catch (err) {
    if (err && err.code === '23505') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    next(err);
  }
});

module.exports = router;