import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Import the new CSS file
import { Link } from 'react-router-dom'; // Import Link for navigation

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 
    try {
      const response = await axios.post('https://dishlooks.onrender.com/api/auth/login', { email, password });
      const { restaurantId } = response.data;
      if (response.data.success) {
        navigate('/dashboard', { state: { restaurantId } });
      }else {
        setErrorMessage(response.data.message); // Set the error message from the response
      }
    } catch (error) {
      console.error('Login failed', error);
      setErrorMessage('An error occurred. Please try again.'); 
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p className="register-link">
        Don't have an account? <Link to="/signup">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
