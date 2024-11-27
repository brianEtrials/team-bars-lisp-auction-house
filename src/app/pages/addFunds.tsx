'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AddFundsProps {
  usernamedata: string;
  onFundsUpdate: () => void; // Callback to refresh parent component
}

export default function AddFunds({ usernamedata, onFundsUpdate }: AddFundsProps) {
  const [funds, setFunds] = useState<string | undefined>();
  const [inputValue, setInputValue] = useState('');

  // Fetch funds
  const fetchFunds = async () => {
    try {
      const response = await axios.get('https://zcyerq8t8e.execute-api.us-east-1.amazonaws.com/review-profile', {
        params: { username: usernamedata },
      });
      const responseData = typeof response.data.body === 'string' ? JSON.parse(response.data.body) : response.data;
      setFunds(responseData?.funds || '0');
    } catch (error) {
      console.error("Failed to fetch funds:", error);
      alert("Failed to fetch funds.");
      setFunds('0');
    }
  };

  // Add amount
  const addAmount = async () => {
    const amountToAdd = parseFloat(inputValue);
    if (!isNaN(amountToAdd)) {
      try {
        if (!usernamedata.trim()) throw new Error("Invalid username provided.");
        await axios.post('https://tqqne0xyr2.execute-api.us-east-1.amazonaws.com/update-profile', {
          usernamedata,
          funds: amountToAdd,
        });
        setInputValue('');
        alert("Funds updated successfully!");
        fetchFunds(); // Refresh funds locally
        onFundsUpdate(); // Notify parent to refresh if needed
      } catch (error: any) {
        console.error("Failed to update funds:", error);
        alert("Failed to update funds. " + (error.response ? error.response.data : error.message));
      }
    } else {
      alert("Please enter a valid number.");
    }
  };

  useEffect(() => {
    fetchFunds();
  }, [usernamedata]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <label className="funds">{"Current Funds: $" + (funds !== undefined ? funds : 'Loading...')}</label>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter amount"
      />
      <button
        className="Add"
        onClick={addAmount}
        disabled={isNaN(parseFloat(inputValue)) || inputValue === ''}
      >
        Add Funds
      </button>
    </div>
  );
}
