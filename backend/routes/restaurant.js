const express = require('express');
const Restaurant = require('../models/Restaurant'); // Adjust the path to your Restaurant model
const router = express.Router();
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// GET a specific restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch restaurant by ID
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Send the restaurant details back to the client
    res.json(restaurant);
  } catch (err) {
    console.error('Error fetching restaurant details:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:restaurantId/add_category', async (req, res) => {
  const { restaurantId } = req.params;
  const { category } = req.body;

  try {
    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    // Check if the category already exists
    if (!restaurant.categories.includes(category)) {
      // Add the new category to the restaurant's categories array
      restaurant.categories.push(category);
      // Save the updated restaurant document
      await restaurant.save();
      return res.status(200).json(restaurant.categories);  // Return the updated list of categories
    } else {
      return res.status(400).json({ msg: 'Category already exists' });
    }
  } catch (error) {
    console.error('Error adding category:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/'; // Folder to store uploaded files
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = Date.now() + path.extname(file.originalname);
    cb(null, uniqueFilename); // Generate unique filename
  },
});

const upload = multer({ storage: storage });

// API route for uploading template
router.post('/:id/upload-template', upload.single('template'), async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const templateUrl = `${req.file.filename}`; // Generate the URL for the uploaded file

    // Find the restaurant and update the template URL
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { templateUrl },
      { new: true }
    );

    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading template' });
  }
});



router.get('/:id/template', async (req, res) => {
  const restaurantId = req.params.id;
  // Fetch the template URL from your database for this restaurant
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant && restaurant.templateUrl) {
      res.json({ templateUrl: `/uploads/${restaurant.templateUrl}` });
    } else {
      res.status(404).json({ message: 'Template not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching template' });
  }
});

// Route to get all orders for a specific restaurant
router.get('/:id/orders', async (req, res) => {
  const restaurantId  = req.params.id;
  try {
    const orders = await Order.find({ restaurantId }).sort({ placedAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});


module.exports = router;
