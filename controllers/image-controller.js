const Image = require('../models/Image');
const { uploadToCloudinary } = require('../handler/cloudinaryHandler');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    const newImage = new Image({ url, publicId, uploadedBy: req.user.id });
    await newImage.save();
    fs.unlinkSync(req.file.path);
    res.status(201).json({ success: true, message: 'Image uploaded successfully', image: newImage });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
};
const fetchImagesController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;  
   
    const sortOder = req.query.sort === 'asc' ? 1 : -1;
    const totalImage = await Image.countDocuments({ uploadedBy: req.user.id });
    const totalPages = Math.ceil(totalImage / limit);
    sortObj = { createdAt: sortOder };
     const images = await Image.find({ uploadedBy: req.user.id }).skip(skip).limit(limit).sort(sortObj);
    res.status(200).json({ success: true, page, totalPages, totalImage, images });
  } catch (error) {
    console.error('Fetch images error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch images' });
  }
};


const deleteImageController = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    if(image.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this image' });
    }
    await cloudinary.uploader.destroy(image.publicId);
    await Image.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
};

module.exports = {
  uploadImage,
  fetchImagesController,
  deleteImageController
};