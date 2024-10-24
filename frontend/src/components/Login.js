import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Import the new CSS file
import { Link } from 'react-router-dom'; // Import Link for navigation

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://dishlooks.onrender.com/api/auth/login', { email, password });
      const { restaurantId } = response.data;
      if (response.data.success) {
        navigate('/dashboard', { state: { restaurantId } });
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Restaurant Owner Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="register-link">
        Don't have an account? <Link to="/signup">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
