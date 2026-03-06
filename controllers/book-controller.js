const Book = require('../models/Book');

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No books found'
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Books retrieved successfully',
        data: books
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve books',
      error: error.message
    });
  }
};

const getSingleBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve book',
      error: error.message
    });
  }
};

const updatebookById = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update book',
      error: error.message
    });
  }
};

const deleteBookById = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete book',
      error: error.message
    });
  }
};

const addNewBook = async (req, res) => {
  try {
    const { title, author } = req.body;
    
    // Check for existing book with same title and author
    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: 'Book with this title and author already exists',
        data: existingBook
      });
    }

    const newBook = await Book.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: newBook
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add book',
      error: error.message
    });
  }
};
const getAuthorBooks = async (req, res) => {
  try {
    const books = await Book.find({ author: req.params.authorId }).populate('author');
    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No books found for this author'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve author books',
      error: error.message
    });
  }
};

const getBookByAuthor = async (req, res) => {
  try {
    const books = await Book.find({ author: req.params.authorId }).populate('author');
    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No books found for this author'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      data: books
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to retrieve books by author',
      error: error.message
    });
  }
};


module.exports = {
  getAllBooks,
  getSingleBookById,
  updatebookById,
  deleteBookById,
  addNewBook,
  getAuthorBooks,
  getBookByAuthor
};
