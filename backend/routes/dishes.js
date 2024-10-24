const express = require('express');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

// Get all dishes for a restaurant
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add a new dish to a restaurant
router.post('/:restaurantId/add_dishes', async (req, res) => {
  const { restaurantId } = req.params;
  const { name, category, price, imageUrl, servings, vegNonVeg, nutrition } = req.body;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    const newDish = {
      name,
      category,
      price,
      imageUrl,
      servings,   // Include servings
      vegNonVeg,  // Include Veg/Non-Veg status
      nutrition: {
        protein: nutrition?.protein || 0,  // Default to 0 if not provided
        fat: nutrition?.fat || 0,
        carbohydrates: nutrition?.carbohydrates || 0,
        calories: nutrition?.calories || 0
      }
    };
    if (!restaurant.categories.includes(newDish.category)) {
      restaurant.categories.push(newDish.category);
    }
    restaurant.dishes.push(newDish);
    await restaurant.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete Dish
router.delete('/:restaurantId/dishes/:dishId', async (req, res) => {
  const { restaurantId, dishId } = req.params;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    // Remove the dish from the dishes array
    restaurant.dishes = restaurant.dishes.filter(dish => dish._id.toString() !== dishId);
    await restaurant.save();
    
    res.json({ success: true, msg: 'Dish deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Dish status (Out of Stock)
router.patch('/:restaurantId/dishes/:dishId', async (req, res) => {
  const { restaurantId, dishId } = req.params;
  const { isOutOfStock } = req.body;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });

    const dish = restaurant.dishes.id(dishId);
    if (!dish) return res.status(404).json({ msg: 'Dish not found' });

    dish.isOutOfStock = isOutOfStock; // Update the out of stock status
    await restaurant.save();

    res.json(dish); // Return the updated dish
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
