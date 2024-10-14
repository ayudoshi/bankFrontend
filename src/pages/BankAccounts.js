import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BankAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    bankName: '',
    holderName: '',
    accountNumber: '',
    ifscCode: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all bank accounts when the component mounts
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:3000/api/bank', {
          headers: { Authorization: token },
        });
        setAccounts(res.data); // Set the fetched accounts
      } catch (err) {
        console.error(err);
      }
    };

    fetchAccounts();
  }, []); // Empty dependency array to run only on component mount

  const validateBankName = (name) => /^[a-zA-Z\s]+$/.test(name); // Only letters
  const validateHolderName = (name) => /^[a-zA-Z\s]+$/.test(name); // Only letters
  const validateAccountNumber = (number) => /^[0-9]+$/.test(number); // Only numbers
  const validateIfscCode = (code) => /^[A-Za-z0-9]+$/.test(code); // Alphanumeric

  const handleAddAccount = async (e) => {
    e.preventDefault();
    const { bankName, holderName, accountNumber, ifscCode } = formData;

    if (!validateBankName(bankName)) {
      setError('Bank name must only contain letters');
      return;
    }
    if (!validateHolderName(holderName)) {
      setError('Holder name must only contain letters');
      return;
    }
    if (!validateAccountNumber(accountNumber)) {
      setError('Account number must only contain numbers');
      return;
    }
    if (!validateIfscCode(ifscCode)) {
      setError('IFSC code must contain only letters and numbers');
      return;
    }

    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://127.0.0.1:3000/api/bank/add', formData, {
        headers: { Authorization: token },
      });
      setAccounts(res.data); // Update accounts with the new account added
      setFormData({ bankName: '', holderName: '', accountNumber: '', ifscCode: '' }); // Clear form
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
    <div>
      <h2>Bank Accounts</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddAccount}>
        <input
          type="text"
          value={formData.bankName}
          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
          placeholder="Bank Name"
        />
        <input
          type="text"
          value={formData.holderName}
          onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
          placeholder="Holder Name"
        />
        <input
          type="text"
          value={formData.accountNumber}
          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
          placeholder="Account Number"
        />
        <input
          type="text"
          value={formData.ifscCode}
          onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
          placeholder="IFSC Code"
        />
        <button type="submit">Add Account</button>
      </form>
      <ul>
        {accounts.map(account => (
          <li key={account._id}>
            {account.bankName} - {account.accountNumber} ({account.holderName})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BankAccounts;
