const express = require('express');
const authRequired = require('../middlewares/authRequired');

const router = express.Router();

router.get('/', authRequired, (req, res) => {
  res.json({
    user: {
      id: req.user.sub,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

module.exports = router;
