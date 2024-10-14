import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9]+$/; // Only letters and numbers
    return regex.test(username);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateUsername(username)) {
      setError('Username must contain only letters and numbers');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
      return;
    }
    setError('');
    try {
      await axios.post('http://127.0.0.1:3000/api/auth/register', { username, password });
      navigate('/login');  // Redirect to login after successful registration
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Display the error message from the backend
        setError(err.response.data.message);
      } else {
        // Handle other potential errors
        setError('Something went wrong. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
