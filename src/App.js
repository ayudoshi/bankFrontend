import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import BankAccounts from './pages/BankAccounts';
import AdminDashboard from './pages/AdminDashboard';
import './styles.css'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />               {/* Home page with login/register buttons */}
        <Route path="/register" element={<Register />} />   {/* Register page */}
        <Route path="/login" element={<Login />} />         {/* Login page */}
        <Route path="/bank-accounts" element={<BankAccounts />} /> {/* Bank accounts management page */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
