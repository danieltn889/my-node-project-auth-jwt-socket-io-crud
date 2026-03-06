const express = require('express');
const router = express.Router();
const { insertSampleProducts,getProductStats,updateProductCategories,getProductAnalytics } = require('../controllers/product-controller');

router.get('/insert-sample-products', insertSampleProducts);
router.get('/stats', getProductStats);
router.put('/update-categories', updateProductCategories);
router.get('/analytics', getProductAnalytics);

module.exports = router;

