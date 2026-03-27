const express = require('express');
const validateCreateUser = require('../middlewares/validateCreateUser');
const { createUser, listUsers, getUserById, updateUser } = require('../repositories/user.repo');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(100, limit)) : 50;
    const users = await listUsers(safeLimit);
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(Number(id));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

router.post('/', validateCreateUser, async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const name = req.body.name.trim();
    const password = req.body.password;
    const role = typeof req.body.role === 'string' && req.body.role.trim() ? req.body.role.trim() : 'User';
    const status = typeof req.body.status === 'string' && req.body.status.trim() ? req.body.status.trim() : 'Active';

    const user = await createUser({ email, name, password, role, status });

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

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, name, role, status } = req.body ?? {};

    if (typeof email !== 'string' || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ message: 'email is invalid' });
    }

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'name is required' });
    }

    const updated = await updateUser(Number(id), {
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: typeof role === 'string' && role.trim() ? role.trim() : 'User',
      status: typeof status === 'string' && status.trim() ? status.trim() : 'Active',
    });

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ data: updated });
  } catch (err) {
    if (err && err.code === '23505') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    next(err);
  }
});

module.exports = router;
