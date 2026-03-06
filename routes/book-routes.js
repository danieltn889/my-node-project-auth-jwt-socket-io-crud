const express = require('express');
const router = express.Router();
const { getAllBooks,
  getSingleBookById,
  updatebookById,
  deleteBookById,
  addNewBook,
  getAuthorBooks,
  getBookByAuthor } = require('../controllers/book-controller');
const { createAuthor, getAuthors } = require('../controllers/author-ccontroller');

//all routes related to books
router.get('/get', getAllBooks);

router.post('/add', addNewBook);
router.get('/get/:id', getSingleBookById);
router.put('/update/:id', updatebookById);
router.delete('/delete/:id', deleteBookById);
router.get('/author/:authorId', getAuthorBooks);
router.post('/author', createAuthor);
router.get('/author/:authorId', getBookByAuthor);
module.exports = router;
