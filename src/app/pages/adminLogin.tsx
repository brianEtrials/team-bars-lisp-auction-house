'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminCredentials((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://64xg0dthw8.execute-api.us-east-1.amazonaws.com/admin-login/admin-login',
        JSON.stringify(adminCredentials), // Ensure the body is stringified
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
  
      console.log("Full response:", response);
  
      // Parse the response data
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
  
      // Parse the body field inside the response
      const parsedBody = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
  
      console.log("Parsed body:", parsedBody);
  
      if (response.status === 200 && parsedBody.message === "Admin login successful") {
        alert('Admin login successful');
        navigate('/adminDashboard');
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      alert('Invalid admin credentials');
    }
  };
   
  

  return (
    <div className="account">
      <h2>Admin Login</h2>
      <form onSubmit={handleAdminLogin}>
        <input
          type="text"
          name="username"
          value={adminCredentials.username}
          onChange={handleInputChange}
          placeholder="Admin Username"
        />
        <input
          type="password"
          name="password"
          value={adminCredentials.password}
          onChange={handleInputChange}
          placeholder="Admin Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
