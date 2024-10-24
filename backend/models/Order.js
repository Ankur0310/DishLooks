const mongoose = require('mongoose');

// Define schema for individual ordered items
const OrderedItemSchema = new mongoose.Schema({
  dishId: { type: String, required: true }, // Dish ID from the restaurant
  name: { type: String, required: true },   // Name of the dish
  price: { type: Number, required: true },  // Price of the dish
  quantity: { type: Number, required: true, default: 1 } // Quantity ordered
});

// Define schema for orders
const OrderSchema = new mongoose.Schema({
  restaurantId: { 
    type: String, 
    ref: 'Restaurant', // Reference to the restaurant
    required: true 
  },
  tableNumber: { type: String, required: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  items: [OrderedItemSchema], // Array of ordered items
  totalPrice: { type: Number, required: true }, // Total price of the order
  orderStatus: { 
    type: String, 
    enum: ['Placed', 'Preparing', 'Completed'], 
    default: 'Placed' 
  },
  placedAt: { type: Date, default: Date.now } // Timestamp when the order was placed
});

module.exports = mongoose.model('Order', OrderSchema);
