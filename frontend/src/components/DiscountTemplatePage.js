// src/components/DiscountTemplatePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../styles/DiscountTemplatePage.css'; // Adjust the path as necessary


const DiscountTemplatePage = () => {
  //const [templateUrl, setTemplateUrl] = useState('');
  const [restaurant, setRestaurant] = useState(null);
  const location = useLocation();
  const restaurantId = location.state?.id;


  useEffect(() => {
    // Fetch the template URL uploaded by the restaurant owner
    const fetchTemplateUrl = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurant/${restaurantId}/template`);
       // setTemplateUrl(response.data.templateUrl);
        setRestaurant(response.data);
      } catch (error) {
        console.error('Error fetching template URL:', error);
      }
    };

    fetchTemplateUrl();
  }, [restaurantId]);

  return (
    <div className="download-page">
      {restaurant ? (
        <>
          <div className='discount_card'>
            <div className='discount_page_heading'><h2>Story Template</h2></div>
            <img src="/images/share.jpg" alt="shareit" className="banner_img" />
            <p>Share this story template with your photos on your story and also tag us for getting more Discount.</p>
            {restaurant.templateUrl ? (
              <a href={`http://localhost:5000${restaurant.templateUrl}`} download>
                <button>Download Template</button>
              </a>
            ) : (
              <p>No template available for download.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DiscountTemplatePage;
