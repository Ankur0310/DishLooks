import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/RestaurantPage.css';

function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // Veg/Non-Veg filter
  const [filterCategory, setFilterCategory] = useState('All'); // Category filter
  const [sortOrder, setSortOrder] = useState('category'); // Default sort by category
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // For the modal
  const [cart, setCart] = useState([]); // Cart state

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`https://dishlooks.onrender.com/api/restaurant/${id}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    };
    fetchRestaurant();
  }, [id]);

  // Handle filtering by Veg/Non-Veg, Category, and Search Term
  const filteredDishes = restaurant
    ? restaurant.dishes.filter((dish) => {
        const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType =
          filterType === 'All' ||
          (filterType === 'Veg' && dish.vegNonVeg === 'Veg') ||
          (filterType === 'Non-Veg' && dish.vegNonVeg === 'Non-Veg');
        const matchesCategory = filterCategory === 'All' || dish.category === filterCategory;
        return matchesSearch && matchesType && matchesCategory && !dish.isOutOfStock;
      })
    : [];

  const sortedDishes = filteredDishes.sort((a, b) => {
    if (sortOrder === 'category') {
      return a.category.localeCompare(b.category); // Sort by category alphabetically
    }
    return sortOrder === 'asc' ? a.price - b.price : b.price - a.price; // Sort by price if selected
  });

  const toggleFilter = (type) => {
    setFilterType((prevType) => (prevType === type ? 'All' : type)); // Toggle between selected and deselected states
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const applyFilters = () => {
    toggleFilterModal(); // Close modal after applying filters
  };

  // Add dish to cart
  const addToCart = (dish) => {
    setCart((prevCart) => [...prevCart, dish]);
  };

  // Redirect to Cart page
  const goToCart = () => {
    navigate(`/restaurant/${id}/cart`, { state: { cart, restaurantId: id } });
  };

  return (
    <div className="restaurant-page">
      {restaurant ? (
        <>
          <div className="restaurant-header">
            <h2>{restaurant.name}</h2>
          </div>

          {/* Search bar and Veg/Non-Veg filters */}
          <div className="filter-search">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />

            {/* Veg and Non-Veg Buttons */}
            <div className="filter-buttons">
              <button
                className={`filter-button veg ${filterType === 'Veg' ? 'active' : ''}`}
                onClick={() => toggleFilter('Veg')}
              >
                 <img src="/images/veg.png" alt="veg" className="icon" />
              </button>

              <button
                className={`filter-button non-veg ${filterType === 'Non-Veg' ? 'active' : ''}`}
                onClick={() => toggleFilter('Non-Veg')}
              >
                <img src="/images/nonveg.png" alt="nonveg" className="icon" />
              </button>

              <button className="filter-modal-button" onClick={toggleFilterModal}>
              <img src="/images/filters.png" alt="filterr" className="icon" />
              </button>
            </div>

            <div className='navbar_buttons'>
                <div className="discount-button">
                  <button
                    className="win-discount-button"
                    onClick={() => navigate(`/restaurant/${id}/template`, { state: { id } })}
                  >
                    Win Discounts 
                  </button>
                </div>
                <div className='view_cart'>
                    <button className="view-cart-button" onClick={goToCart}>
                    View Cart ({cart.length})
                  </button>
                </div>
            </div>
          </div>

          {/* Dish list */}
          <ul className="dish-list">
            {sortedDishes.map((dish) => (
              <li key={dish._id} className={`dish-item_menu ${dish.isOutOfStock ? 'out-of-stock' : ''}`}>
                <img src={dish.imageUrl} alt={dish.name} className="dish-image" />
                <div className="dish-details">
                  <strong>{dish.name}</strong> - {dish.category} - ₹{dish.price}
                  <p>Servings: {dish.servings || 'N/A'}</p>
                  <p>Calories: {dish.nutrition?.calories || 'N/A'} kcal</p>
                </div>
                <div className='add_to_cart'>
                  <button className="add-to-cart-button" onClick={() => addToCart(dish)}>
                  <img src="/images/order.webp" alt="Add to Cart" className="icon" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          

          {/* Filter and Sort Modal */}
          {isFilterModalOpen && (
            <div className="filter-modal">
              <div className="filter-modal-content">
                <h3>Filter & Sort</h3>
                <div>
                  <label>Category:</label>
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="All">All Categories</option>
                    {restaurant.categories &&
                      restaurant.categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label>Sort by:</label>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="category">Sort by Category</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                  </select>
                </div>

                <div className='filter_popoup_buttons'>
                <button onClick={applyFilters}>Apply Filters</button>
                <button onClick={toggleFilterModal}>Close</button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default RestaurantPage;
