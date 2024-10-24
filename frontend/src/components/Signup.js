import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css'; // Import the new CSS file
import { Link } from 'react-router-dom'; // Import Link for navigation

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { email, password, restaurantName }, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup failed', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Restaurant Owner Signup</h2>
      <form className="signup-form" onSubmit={handleSignup}>
        <input
          type="text"
          className="signup-input"
          placeholder="Restaurant Name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          required
        />
        <input
          type="email"
          className="signup-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="signup-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <p className="login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Signup;
