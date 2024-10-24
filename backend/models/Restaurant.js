const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const NutritionSchema = new mongoose.Schema({
  protein: { type: Number},  // Protein in grams
  fat: { type: Number },      // Fat in grams
  carbohydrates: { type: Number }, // Carbohydrates in grams
  calories: { type: Number }  // Total calories
});

const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  isOutOfStock: {
    type: Boolean,
    default: false 
  },
  servings: { type: Number },        
  vegNonVeg: { type: String, enum: ['Veg', 'Non-Veg'] }, 
  nutrition: NutritionSchema,
  modelUrl: { type: String }       
});

const RestaurantSchema = new mongoose.Schema({
  _id: { 
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  categories: { type: [String], default: [] },
  dishes: [DishSchema],
  templateUrl: {
    type: String,  // URL to the story template file (e.g., image or video)
    required: false,
  },
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
