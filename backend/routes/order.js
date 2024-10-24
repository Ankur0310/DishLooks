const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Import the Order model
const Restaurant = require('../models/Restaurant'); // Import the Restaurant model

// Route to place a new order
router.post('/new', async (req, res) => {
  try {
    const { restaurantId, tableNumber, name, mobile, items } = req.body;

    // Calculate total price
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Create new order
    const newOrder = new Order({
      restaurantId,
      tableNumber,
      name,
      mobile,
      items,
      totalPrice,
    });

    // Save order to the database
    await newOrder.save();

    res.status(200).json({ message: 'Order placed successfully!', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place the order' });
  }
});

module.exports = router;
