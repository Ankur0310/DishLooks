import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AddDishForm from './AddDishForm';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css'; // Import the CSS
import UploadPopup from './UploadPopup'; // Popup for uploading templates

const Dashboard = () => {
  const location = useLocation();
  const [restaurant, setRestaurant] = useState(null);
  const [showUploadPopup, setShowUploadPopup] = useState(false); // State to control popup visibility
  const navigate = useNavigate();
  const restaurantId = location.state?.restaurantId;

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantId) {
        console.error('No restaurant ID found');
        return;
      }
      try {
        const response = await axios.get(`https://dishlooks.onrender.com/api/dishes/${restaurantId}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error('Error fetching restaurant details', error);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  const NavigateToOrderPage = () => {
    navigate(`/restaurant/${restaurantId}/orders`, { state: { restaurantId } });
  };

  const NavigateToDishesPage = () => {
    navigate(`/restaurant/${restaurantId}/dishes`, { state: { restaurantId } });
  };

  const NavigateToMenuPage = () => {
    navigate(`/restaurant/${restaurantId}`, { state: { restaurantId } }); // Add this line to navigate to the restaurant menu
  };

  const toggleUploadPopup = () => {
    setShowUploadPopup(!showUploadPopup);
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar-dashboard">
        <div className='dashborad_heading'>
          <h1 className="restaurant-name">{restaurant ? restaurant.name : 'Restaurant Dashboard'}</h1>
        </div>
        <ul className="navbar-links">
          <li onClick={NavigateToMenuPage}>Restaurant Menu</li> 
          <li onClick={NavigateToDishesPage}>Existing Dishes</li>
          <li onClick={NavigateToOrderPage}>Order Page</li>
          <li onClick={toggleUploadPopup}>Upload Template</li>
        </ul>
      </nav>

      <div className="content-section">
        <div className='dashboard_subheading'><h2>Add New Dish</h2></div>
        <AddDishForm restaurantId={restaurantId} />
      </div>

      {showUploadPopup && <UploadPopup restaurantId={restaurantId} togglePopup={toggleUploadPopup} />}
    </div>
  );
};

export default Dashboard;
