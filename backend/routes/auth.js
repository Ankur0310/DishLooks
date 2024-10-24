const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password, restaurantName } = req.body;
  try {
    let restaurant = await Restaurant.findOne({ email });
    if (restaurant) {
      return res.status(400).json({ success: false, message: 'Restaurant owner already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    restaurant = new Restaurant({
      _id: uuidv4(),
      email,
      password: hashedPassword,
      name: restaurantName,
      dishes: [],  
    });

    await restaurant.save();

    res.status(201).json({ success: true, message: 'Restaurant owner registered successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find restaurant owner by email
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(400).json({ success: false, message: 'Restaurant not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create and send JWT token
    const token = jwt.sign({ restaurantId: restaurant._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token, restaurantId: restaurant._id, name: restaurant.name });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
