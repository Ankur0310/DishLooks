import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../styles/DishesPage.css';

const DishesPage = () => {
  const location = useLocation();
  const [dishes, setDishes] = useState([]);
  const restaurantId = location.state?.restaurantId;

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/dishes/${restaurantId}`);
        setDishes(response.data.dishes);
      } catch (error) {
        console.error('Error fetching dishes', error);
      }
    };

    fetchDishes();
  }, [restaurantId]);

  const handleDeleteDish = async (dishId) => {
    try {
      await axios.delete(`http://localhost:5000/api/dishes/${restaurantId}/dishes/${dishId}`);
      setDishes(dishes.filter(dish => dish._id !== dishId));
    } catch (error) {
      console.error('Error deleting dish', error);
    }
  };

  const handleToggleOutOfStock = async (dishId, currentStatus) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/dishes/${restaurantId}/dishes/${dishId}`, {
        isOutOfStock: !currentStatus
      });
      setDishes(dishes.map(dish => (dish._id === dishId ? response.data : dish)));
    } catch (error) {
      console.error('Error updating dish status', error);
    }
  };

  return (
    <div>
      <div className='dishes_container'>
          <div className='existing_dishes'>
            <div className='dishes_heading'><h2>Existing Dishes</h2></div>
              <ul className="dishes-list">
                {dishes.map((dish) => (
                  <li key={dish._id} className="dish-item">
                    <div className='left_item'>
                        <div className='dish_image'>
                        {dish.imageUrl && <img src={dish.imageUrl} alt={dish.name} width="50" />}
                        </div>
                        <div className="dish-details">
                          <div className="dish-name">{dish.name}</div>
                          <div className="dish-category">{dish.category}</div>
                          <div className="dish-price">₹{dish.price}</div>
                        </div>
                    </div>
                    
                    <div className="dish-buttons">
                      <button className="delete-button" onClick={() => handleDeleteDish(dish._id)}>Delete</button>
                      <button className="out-of-stock-button" onClick={() => handleToggleOutOfStock(dish._id, dish.isOutOfStock)}>
                        {dish.isOutOfStock ? 'Mark as Available' : 'Mark as Out of Stock'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
          </div>
      </div>
    </div>
  );
};

export default DishesPage;
