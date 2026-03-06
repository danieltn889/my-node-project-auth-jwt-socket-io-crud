const express = require('express');
const { uploadImage, fetchImagesController,deleteImageController } = require('../controllers/image-controller');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');

const router = express.Router();

router.post('/upload', authMiddleware, adminMiddleware, uploadMiddleware.single('image'), uploadImage);
router.get('/get', authMiddleware, adminMiddleware, fetchImagesController);
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;