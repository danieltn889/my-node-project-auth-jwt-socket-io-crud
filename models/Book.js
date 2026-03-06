const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true,
        maxLength: 100
    },
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: [true, 'Author is required']
    },
    year: {
        type: Number,
        required: [true, 'Publication year is required'],
        min: 1450,
        max: new Date().getFullYear(),
        default: new Date().getFullYear()
    }
});

module.exports = mongoose.model('Book', BookSchema);