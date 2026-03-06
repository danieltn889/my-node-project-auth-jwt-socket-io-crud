const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {  
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    inStock: {
        type: Boolean,
        default: true
    },
    tags: {
        type: [String],
        default: []
    },
    category: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },imageUrl: {
        type: String,
        trim: true
    }
}, { timestamps: true});

module.exports = mongoose.model('Product', ProductSchema);