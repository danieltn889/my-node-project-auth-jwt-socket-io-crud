const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const routes = express.Router();

routes.get('/', authMiddleware,adminMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = routes;