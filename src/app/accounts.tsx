'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Accounts() {
  // Initial state for account information
  const [info, setAccountInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    funds: '',
    accountType: 'buyer' // Default account type
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAccountInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  // Handle form submission to create an account
  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents page from reloading after form submission

    // Preparing the request data
    const accountData = {
      firstName: info.firstName,
      lastName: info.lastName,
      email: info.email,
      funds: parseFloat(info.funds) || 0.0, // Converts funds to a number
      accountType: info.accountType
    };

    try {
      // Sending a POST request to the Lambda function endpoint
      // This needs to be corrected!
      await axios.post('https://56jlr8kgak.execute-api.us-east-1.amazonaws.com/initial/create-account', accountData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Successful creation of account');
      // Reset form fields after successful submission
      setAccountInfo({
        firstName: '',
        lastName: '',
        email: '',
        funds: '',
        accountType: 'buyer'
      });
    } catch (error) {
      console.log('Error when creating account:', error);
    }
    console.log("Account created with:", accountData);
  };

  return (
    <form onSubmit={handleCreateAccount}>
      <input
        type="text"
        name="firstName"
        value={info.firstName}
        onChange={handleInputChange}
        placeholder="First Name"
      />
      <input
        type="text"
        name="lastName"
        value={info.lastName}
        onChange={handleInputChange}
        placeholder="Last Name"
      />
      <input
        type="email"
        name="email"
        value={info.email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <input
        type="number"
        step="0.01"
        name="funds"
        value={info.funds}
        onChange={handleInputChange}
        placeholder="Funds"
      />
      <select
        name="accountType"
        value={info.accountType}
        onChange={handleInputChange}
      >
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>
      <button type="submit">Create Account</button>
    </form>
  );
}
