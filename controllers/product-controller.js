const Product = require('../models/Product');

const getProductStats=async (req, res) => {
  try {
    const result=await Product.aggregate([
      {
        $match: { inStock: true, price: { $gte: 20 } }
      },
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
    ]);
    console.log(result);
    res.status(200).json({ success: true, message: 'Products fetched successfully', data: result });
  }catch (error) { 
    res.status(500).json({ success: false, message: 'Failed to fetch product status' , error: error.message });
  }
};

const insertSampleProducts = async (req, res) => {
  const sampleProducts = [
    {
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with USB receiver",
      price: 15.99,
      inStock: true,
      category: "Electronics",
      tags: ["electronics", "accessories"]
    },
    {
      name: "Mechanical Keyboard",
      description: "RGB backlit mechanical keyboard for gaming",
      price: 59.99,
      inStock: true,
      category: "Electronics",
      tags: ["electronics", "gaming"]
    },
    {
      name: "Bluetooth Headphones",
      description: "Noise-cancelling over-ear Bluetooth headphones",
      price: 89.99,
      inStock: true,
      category: "Audio",
      tags: ["audio", "electronics"]
    },
    {
      name: "Laptop Stand",
      description: "Adjustable aluminum laptop stand",
      price: 24.99,
      inStock: true,
      category: "Office",
      tags: ["office", "accessories"]
    },
    {
      name: "USB-C Charger",
      description: "Fast charging USB-C power adapter",
      price: 18.50,
      inStock: true,
      category: "Electronics",
      tags: ["electronics", "charger"]
    },
    {
      name: "Smartphone Tripod",
      description: "Flexible tripod for smartphones and cameras",
      price: 12.99,
      inStock: true,
      category: "Photography",
      tags: ["photography", "accessories"]
    },
    {
      name: "Portable SSD",
      description: "High-speed portable SSD storage device",
      price: 129.99,
      inStock: true,
      category: "Storage",
      tags: ["storage", "electronics"]
    },
    {
      name: "Gaming Mouse Pad",
      description: "Large anti-slip gaming mouse pad",
      price: 14.99,
      inStock: true,
      category: "Gaming",
      tags: ["gaming", "accessories"]
    },
    {
      name: "Webcam HD",
      description: "1080p HD webcam for streaming and meetings",
      price: 39.99,
      inStock: true,
      category: "Electronics",
      tags: ["electronics", "camera"]
    },
    {
      name: "Desk Lamp",
      description: "LED desk lamp with adjustable brightness",
      price: 22.99,
      inStock: true,
      category: "Office",
      tags: ["office", "lighting"]
    },
    {
      name: "Wireless Charger",
      description: "Qi-enabled wireless charging pad",
      price: 17.99,
      inStock: true,
      category: "Electronics",
      tags: ["electronics", "charger"]
    },
    {
      name: "Laptop Backpack",
      description: "Water-resistant backpack for laptops",
      price: 34.99,
      inStock: true,
      category: "Bags",
      tags: ["bags", "travel"]
    },
    {
      name: "External Hard Drive",
      description: "2TB USB external hard drive",
      price: 79.99,
      inStock: true,
      category: "Storage",
      tags: ["storage", "electronics"]
    },
    {
      name: "Smart Watch",
      description: "Fitness tracking smartwatch with heart monitor",
      price: 149.99,
      inStock: true,
      category: "Wearables",
      tags: ["wearable", "electronics"]
    },
    {
      name: "Portable Speaker",
      description: "Bluetooth portable speaker with deep bass",
      price: 49.99,
      inStock: true,
      category: "Audio",
      tags: ["audio", "electronics"]
    },
    {
      name: "USB Hub",
      description: "Multiport USB hub with 4 USB ports",
      price: 13.99,
      inStock: true,
      category: "Electronics",
      tags: ["electronics", "accessories"]
    },
    {
      name: "Smartphone Gimbal",
      description: "3-axis stabilizer for smartphone video recording",
      price: 99.99,
      inStock: true,
      category: "Photography",
      tags: ["photography", "video"]
    },
    {
      name: "Noise Cancelling Earbuds",
      description: "True wireless earbuds with ANC technology",
      price: 69.99,
      inStock: true,
      category: "Audio",
      tags: ["audio", "electronics"]
    },
    {
      name: "Monitor Stand",
      description: "Adjustable monitor stand with storage space",
      price: 27.99,
      inStock: true,
      category: "Office",
      tags: ["office", "accessories"]
    },
    {
      name: "Keyboard Wrist Rest",
      description: "Memory foam wrist rest for comfortable typing",
      price: 11.99,
      inStock: true,
      category: "Office",
      tags: ["office", "comfort"]
    }
  ];

  try {
    // Check for existing products to avoid duplicates
    const existingNames = await Product.find({ name: { $in: sampleProducts.map(p => p.name) } }).select('name');
    const existingNamesSet = new Set(existingNames.map(p => p.name));
    
    const newProducts = sampleProducts.filter(p => !existingNamesSet.has(p.name));
    
    if (newProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All sample products already exist",
        data: []
      });
    }

    const result = await Product.insertMany(newProducts);

    res.status(201).json({
      success: true,
      message: `${newProducts.length} sample products inserted successfully (${sampleProducts.length - newProducts.length} already existed)`,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to insert sample products",
      error: error.message
    });
  }
};

const updateProductCategories = async (req, res) => {
  try {

    await Product.updateMany(
      { tags: { $in: ["electronics"] } },
      { $set: { category: "Electronics" } }
    );

    await Product.updateMany(
      { tags: { $in: ["audio"] } },
      { $set: { category: "Audio" } }
    );

    await Product.updateMany(
      { tags: { $in: ["office"] } },
      { $set: { category: "Office" } }
    );

    await Product.updateMany(
      { tags: { $in: ["gaming"] } },
      { $set: { category: "Gaming" } }
    );

    res.status(200).json({
      success: true,
      message: "Product categories updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update categories",
      error: error.message
    });
  }
};

const getProductAnalytics = async (req, res) => {
  try {
    const analytics = await Product.aggregate([
      {
        $match: {
          category: "Electronics"
        }
      },
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          inStockCount: { $sum: { $cond: ["$inStock", 1, 0] } },
          outOfStockCount: { $sum: { $cond: ["$inStock", 0, 1] } }
          
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalProducts: 1,
          averagePrice: { $round: ["$averagePrice", 2] },
          minPrice: 1,
          maxPrice: 1,
          inStockCount: 1,
          prieceRange: {
            $subtract: ["$maxPrice", "$minPrice"]
          },
          priceCategory: {
            $switch: {
              branches: [
                { case: { $lte: ["$maxPrice", 50] }, then: "Low" },
                { case: { $lte: ["$maxPrice", 100] }, then: "Medium" }
              ],
              default: "High"
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Product analytics retrieved successfully",
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product analytics",
      error: error.message
    });
  }
};

module.exports = {
  insertSampleProducts,
  getProductStats,
  updateProductCategories,
  getProductAnalytics
}