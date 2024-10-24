import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CartPage.css';

function CartPage() {
  const { state } = useLocation();
  const { cart, restaurantId } = state;
  const navigate = useNavigate();

  const [tableNumber, setTableNumber] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const placeOrder = async () => {
    const orderDetails = {
      restaurantId,
      tableNumber,
      name,
      mobile,
      items: cart.map(item => ({
        dishId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1 // Add logic for quantity if needed
      }))
    };
    try {
      const response = await axios.post('http://localhost:5000/api/order/new', orderDetails);
      if (response.status === 200) {
        alert('Order placed successfully!');
        navigate(`/restaurant/${restaurantId}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place the order. Please try again.');
    }
  };
  

  return (
    <div className="cart-page_container">
      <div className='cart-page'>
      <div className='cart_page_heading'><h2>CART</h2></div>
      {cart.length > 0 ? (
        <>
          <ul className="cart-items-list">
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ₹{item.price}
              </li>
            ))}
          </ul>

          <div className="order-details-form">
            <label>Table Number:</label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Enter your table number"
            />

            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />

            <label>Mobile Number:</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
            />

            <button className="place-order-button" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty</p>
      )}
      </div>
    </div>
  );
}

export default CartPage;
