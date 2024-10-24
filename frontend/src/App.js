import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.js';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard.js';
import RestaurantPage from './components/RestaurantPage.js';
import DiscountTemplatePage from './components/DiscountTemplatePage.js';
import CartPage from './components/CartPage.js';
import OrdersPage from './components/OrdersPage.js';
import DishesPage from './components/DishesPage.js';


function App() {
  return (
    <Router>
      <Routes>
        {/* Route for restaurant owner signup */}
        <Route path="/signup" element={<Signup />} />

        {/* Route for restaurant owner login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard for adding/updating dishes, only accessible after login */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Public page to display restaurant menu */}
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/restaurant/:id/cart" element={<CartPage />} />
        <Route path="/restaurant/:id/template" element={<DiscountTemplatePage />} />
        <Route path="/restaurant/:id/dishes" element={<DishesPage />} />
        <Route path="/restaurant/:id/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
