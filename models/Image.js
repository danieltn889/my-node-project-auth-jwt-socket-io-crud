const mongoose = require('mongoose');
const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'Image URL is required'],
        trim: true
    },
    publicId: {
        type: String,
        required: [true, 'Public ID is required'],
        trim: true  
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);