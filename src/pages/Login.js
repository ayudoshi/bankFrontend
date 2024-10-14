import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');  // State to handle error message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://bankbackend-hh8c.onrender.com/api/auth/login', formData);
      // Assuming the backend responds with the token on success
      localStorage.setItem('token', res.data.token);
      setError('');  // Clear error if login is successful
      navigate('/bank-accounts');  // Navigate to the bank accounts page after login
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Display the error message from the backend
        setError(err.response.data.message);
      } else {
        // Handle other potential errors
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display the error message */}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
