const express = require('express');
const router = express.Router();
const {  createAuthor,getAuthors } = require('../controllers/author-ccontroller');
router.get('/stats', getAuthors);
module.exports = router;