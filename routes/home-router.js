const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;