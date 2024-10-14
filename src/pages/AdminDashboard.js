import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../admin.css'; // Import your CSS file here

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('username'); // Default filter is username

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/api/admin/users');
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users to show all users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Handle search and filter based on query and filter type
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    if (query === '') {
      setFilteredUsers(users); // If query is empty, show all users
    } else {
      // Step 1: Exact matches check
      const filtered = users.filter(user => {
        if (filterBy === 'username') {
          return user.username.toLowerCase() === query;
        } else if (filterBy === 'bankName') {
          return user.bankAccounts.some(account => account.bankName.toLowerCase() === query);
        } else if (filterBy === 'accountNumber') {
          return user.bankAccounts.some(account => account.accountNumber.toString() === query);
        } else if (filterBy === 'ifscCode') {
          return user.bankAccounts.some(account => account.ifscCode.toLowerCase() === query);
        }
        return false;
      });
  
      // Step 2: If exact matches found, return exact match
      if (filtered.length > 0) {
        setFilteredUsers(filtered);
      } else {
        // Step 3: Fallback to partial matches if no exact match is found
        const partialFiltered = users.filter(user => {
          if (filterBy === 'username') {
            return user.username.toLowerCase().includes(query);
          } else if (filterBy === 'bankName') {
            return user.bankAccounts.some(account => account.bankName.toLowerCase().includes(query));
          } else if (filterBy === 'accountNumber') {
            return user.bankAccounts.some(account => account.accountNumber.toString().includes(query));
          } else if (filterBy === 'ifscCode') {
            return user.bankAccounts.some(account => account.ifscCode.toLowerCase().startsWith(query));
          }
          return false;
        });
        setFilteredUsers(partialFiltered); // Set users matching partial results
      }
    }
  };
  

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      {/* Search Filter */}
      <div className="search-filter">
        <label htmlFor="filterBy">Search by: </label>
        <select
          id="filterBy"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          <option value="username">Username</option>
          <option value="bankName">Bank Name</option>
          <option value="accountNumber">Account Number</option>
          <option value="ifscCode">IFSC Code</option>
        </select>

        <input
          type="text"
          placeholder={`Enter ${filterBy}`}
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      
      {/* Table displaying users and bank details */}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Bank Name</th>
            <th>Holder Name</th>
            <th>Account Number</th>
            <th>IFSC Code</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              user.bankAccounts.map((account, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{account.bankName}</td>
                  <td>{account.holderName}</td>
                  <td>{account.accountNumber}</td>
                  <td>{account.ifscCode}</td>
                </tr>
              ))
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
