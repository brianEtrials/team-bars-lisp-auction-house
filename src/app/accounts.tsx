'use client'
import axios from 'axios';
import React, { useState } from 'react';

export default function Accounts() {
  // account state
  const [accountInfo, setAccountInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    funds: '',
    accountType: 'buyer',
    username: '',
    password: ''
  });

  // login state
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    password: ''
  });

  // input changes for create account
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  // input changes for login
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  // Handle form submission to create an account
  const handleCreateAccount = async (e) => {
    e.preventDefault(); // Prevents page from reloading after form submission

    // Preparing the request data
    const accountData = {
      firstName: accountInfo.firstName,
      lastName: accountInfo.lastName,
      email: accountInfo.email,
      funds: parseFloat(accountInfo.funds) || 0.0, // Converts funds to a number
      accountType: accountInfo.accountType,
      username: accountInfo.username,
      password: accountInfo.password
    };

    try {
      // lambda for creating account
      await axios.post('https://56jlr8kgak.execute-api.us-east-1.amazonaws.com/initial/create-account', accountData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Successful creation of account');
      // reset fields
      setAccountInfo({
        firstName: '',
        lastName: '',
        email: '',
        funds: '',
        accountType: 'buyer',
        username: '',
        password: '',
      });
    } catch (error) {
      console.log('Error when creating account:', error);
    }
    console.log("Account created with:", accountData);
  };

  // Handle form submission to log in
  const loginAccount = async (e) => {
    e.preventDefault();
  
    // initial login data
    const loginData = {
      username: loginInfo.username,
      password: loginInfo.password
    };
  
    try {
      debugger;
      // lambda for login
      await axios.post('https://c9vzd62jgh.execute-api.us-east-1.amazonaws.com/login/login', loginData, {
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => {
        console.log(res);
        debugger;
      });
      console.log('Successfully logged in');
      
      setLoginInfo({
        username: '',
        password: '',
      });
    } catch (error) {
      console.log('Error during login:', error);
    }
    console.log("Attempted login with:", loginData);
  };

  return (
    <div>
      {/* Login */}
      <form onSubmit={loginAccount}>
        <input
          type="text"
          name="username"
          value={loginInfo.username}
          onChange={handleLoginInputChange}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          value={loginInfo.password}
          onChange={handleLoginInputChange}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>

      <p>-----------------------------------------------------------------</p>

      {/* Create Account */}
      <form onSubmit={handleCreateAccount}>
        <input
          type="text"
          name="firstName"
          value={accountInfo.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
        />
        <input
          type="text"
          name="lastName"
          value={accountInfo.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
        />
        <input
          type="email"
          name="email"
          value={accountInfo.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          type="number"
          step="0.01"
          name="funds"
          value={accountInfo.funds}
          onChange={handleInputChange}
          placeholder="Funds"
        />
        <select
          name="accountType"
          value={accountInfo.accountType}
          onChange={handleInputChange}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <input
          type="text"
          name="username"
          value={accountInfo.username}
          onChange={handleInputChange}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          value={accountInfo.password}
          onChange={handleInputChange}
          placeholder="Password"
        />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
