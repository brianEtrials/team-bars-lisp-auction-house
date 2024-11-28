'use client'
import axios from 'axios';
import React, { useState } from 'react';
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

export default function Accounts() {
  // to navigation from one page to another 
  const navigate = useNavigate();
  // account state
  const [accountInfo, setAccountInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    funds: '',
    accountType: 'buyer',
    username: '',
    password: '',
    status: true
  });

  // login state
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    password: ''
  });



  // input changes for create account
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAccountInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  // input changes for login
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  // Handle form submission to create an account
  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents page from reloading after form submission

    // Preparing the request data
    const accountData = {
      firstName: accountInfo.firstName,
      lastName: accountInfo.lastName,
      email: accountInfo.email,
      funds: parseFloat(accountInfo.funds) || 0.0, // Converts funds to a number
      accountType: accountInfo.accountType,
      username: accountInfo.username,
      password: accountInfo.password,
      status: accountInfo.status
    };
    let accountId = null;
    try {
      // lambda for creating account
      await axios.post('https://56jlr8kgak.execute-api.us-east-1.amazonaws.com/initial/create-account', accountData, {
        headers: { 'Content-Type': 'application/json' }
      }).then((response) => {
        const infoAfterCreateAccount = typeof response.data.body === "string" ? JSON.parse(response.data.body) : response.data.body;
        accountId = infoAfterCreateAccount.accountId;
      });
      console.log('Successful creation of account');
      // Store account info securely in localStorage after account creation
      secureLocalStorage.setItem("userCredentials", {
        id: accountId,
        username: accountInfo.username,
        accountType: accountInfo.accountType
      });

      // Pass account info as state to the BuyerItemsPage
      const storedCredentials = secureLocalStorage.getItem("userCredentials");

      if (accountInfo.accountType === "buyer") {
        navigate("/buyerItemsPage", { state: storedCredentials }); // Pass state here
      } else if (accountInfo.accountType === "seller") {
        navigate("/add_review_items", { state: storedCredentials }); // Navigate to seller account page
      } else {
        alert("Please select a user type before creating an account.");
      }

    } catch (error) {
      console.log('Error creating account:', error);
    }
  };

  // Handle form submission to log in
  const loginAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Initial login data
    const loginData = {
      username: loginInfo.username,
      password: loginInfo.password,
    };
  
    try {
      const response = await axios.post(
        'https://c9vzd62jgh.execute-api.us-east-1.amazonaws.com/login/login',
        loginData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      // Lambda returns response as JSON string - might want to change
      const accountInfo = typeof response.data.body === "string" ? JSON.parse(response.data.body) : response.data.body;

      secureLocalStorage.setItem("userCredentials", {
        username: accountInfo.username,
        account_type: accountInfo.account_type,
      });
      let status = accountInfo.status; 
      if(status === 0){
        alert("Account is closed");
      } else if (status === 1 && accountInfo.account_type === "buyer") {
        navigate("/buyerItemsPage", { state: accountInfo });
      } else if (status === 1 && accountInfo.account_type === "seller") {
        navigate("/add_review_items", { state: accountInfo });
      } else {
        alert("Account type is not recognized.");
      }
  
    } catch (error) {
      console.error('Error during login:', error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className = 'account'>
      {/* Login */}
      <div className="flex flex-col items-center space-y-4" id="design">
        <h2>Login</h2>
      <form className="Account" onSubmit={loginAccount}>
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
        <button className ='Login' type="submit">Login</button>
      </form>

      {/* <p>-----------------------------------------------------------------</p> */}

      {/* Create Account */}
      <h2>Create Account</h2>
      <form  className="Account" onSubmit={handleCreateAccount}>
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
        <select
          name="accountType"
          value={accountInfo.accountType}
          onChange={handleInputChange}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button id ="createAccount" type="submit">Create Account</button>
      </form>
    </div>

    <div className="admin-login-container">
      <button
        onClick={() => navigate('/adminLogin')}
        className="admin-login-button"
      >
        Admin Login
      </button>
    </div>

    </div>
  );
}
