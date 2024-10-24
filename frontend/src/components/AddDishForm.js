import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/addDishForm.css'; // Import the CSS

const AddDishForm = ({ restaurantId }) => {
  const [newDish, setNewDish] = useState({
    name: '',
    category: '',
    price: '',
    imageUrl: '',
    servings: '',
    vegNonVeg: 'Veg', // Default to Veg
    nutrition: {
      protein: '',
      fat: '',
      carbohydrates: '',
      calories: ''
    }
  });

  const [categories, setCategories] = useState([]); // Initially empty, will fetch from restaurant
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurant/${restaurantId}`);
        setCategories(response.data.categories || []); // Fetch existing categories from restaurant
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('nutrition.')) {
      const fieldName = name.split('.')[1]; // Get the nutrition field name
      setNewDish((prevDish) => ({
        ...prevDish,
        nutrition: {
          ...prevDish.nutrition,
          [fieldName]: value
        }
      }));
    } else {
      setNewDish((prevDish) => ({
        ...prevDish,
        [name]: value
      }));
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/dishes/${restaurantId}/add_dishes`, newDish);
      setNewDish({
        name: '',
        category: '',
        price: '',
        imageUrl: '',
        servings: '',
        vegNonVeg: 'Veg',
        nutrition: {
          protein: '',
          fat: '',
          carbohydrates: '',
          calories: ''
        }
      });
    } catch (error) {
      console.error('Error adding dish', error);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      try {
        await axios.put(`http://localhost:5000/api/restaurant/${restaurantId}/add_category`, {
          category: newCategory
        });

        setCategories((prevCategories) => [...prevCategories, newCategory]);
        setNewCategory(''); // Clear the input field after adding
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  return (
    <form className="add-dish-form" onSubmit={handleAddDish}>
      <input
        type="text"
        placeholder="Dish Name"
        name="name"
        value={newDish.name}
        onChange={handleChange}
        required
      />

      <select
        value={newDish.category}
        onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
        required
      >
        <option value="">Select Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>{category}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Price"
        name="price"
        value={newDish.price}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        placeholder="Image URL"
        name="imageUrl"
        value={newDish.imageUrl}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        placeholder="Number of Servings"
        name="servings"
        value={newDish.servings}
        onChange={handleChange}
        required
      />

      <select
        name="vegNonVeg"
        value={newDish.vegNonVeg}
        onChange={handleChange}
        required
      >
        <option value="Veg">Veg</option>
        <option value="Non-Veg">Non-Veg</option>
      </select>

      <h4>Nutritional Information</h4>
      <div className="nutrition-inputs">
        <input
          type="number"
          placeholder="Protein (g)"
          name="nutrition.protein"
          className="nutrition-input"
          value={newDish.nutrition.protein}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          placeholder="Fat (g)"
          name="nutrition.fat"
          className="nutrition-input"
          value={newDish.nutrition.fat}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          placeholder="Carbohydrates (g)"
          name="nutrition.carbohydrates"
          className="nutrition-input"
          value={newDish.nutrition.carbohydrates}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          placeholder="Calories"
          name="nutrition.calories"
          className="nutrition-input"
          value={newDish.nutrition.calories}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Add Dish</button>

      <div className="new-category-container">
        <input
          type="text"
          placeholder="Add New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="button" onClick={handleAddCategory}>Add Category</button>
      </div>
    </form>
  );
};

export default AddDishForm;
