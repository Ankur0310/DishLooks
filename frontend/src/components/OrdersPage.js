import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/OrdersPage.css'; // Import the new CSS file

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const restaurantId = location.state?.restaurantId;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`https://dishlooks.onrender.com/api/restaurant/${restaurantId}/orders`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [restaurantId]);

  return (
    <div className='orderPage_container'>
        <div className="orders-page">
        <h2 className="page-title">Orders</h2>
        <ul className="orders-list">
          {orders.length > 0 ? (
            orders.map((order) => (
              <li key={order._id} className="order-card">
                <div className="order-summary">
                  <strong>Table {order.tableNumber}</strong> - {order.name} - ₹{order.totalPrice}
                </div>
                <ul className="order-items">
                  {order.items.map((item, index) => (
                    <li key={index} className="order-item">
                      {item.name} - ₹{item.price} x {item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="order-status">Status: {order.orderStatus}</p>
              </li>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default OrdersPage;
