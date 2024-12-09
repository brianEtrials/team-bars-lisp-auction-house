'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logout from './logout';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeItemsCount, setActiveItemsCount] = useState(0);
  const [totalBidsCount, setTotalBidsCount] = useState(0);
  const [totalBidsAmount, setTotalBidsAmount] = useState(0);

  // Fetch active items count and total bids count on component mount
  useEffect(() => {
    const fetchAuctionMetrics = async () => {
      try {
        const response = await axios.get(
          'https://u64oh2ryld.execute-api.us-east-1.amazonaws.com/auction-metrics/auction-metrics',
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const data = typeof response.data.body === "string" 
          ? JSON.parse(response.data.body) 
          : response.data.body;

        console.log("Active items count:", data.activeItemsCount);
        console.log("Total bids count:", data.totalBidsCount);
        console.log("Total funds:", data.totalBidsAmount);
        console.log("Revenue Earned:", data.revenueEarned);

        setActiveItemsCount(data.activeItemsCount);
        setTotalBidsCount(data.totalBidsCount);
        setTotalBidsAmount(data.totalBidsAmount);
        setRevenueEarned(data.revenueEarned);
      } catch (error) {
        console.error('Failed to fetch auction metrics:', error);
      }
    };

    fetchAuctionMetrics();
  }, []);

  // Add a new state to store the revenue earned
  const [revenueEarned, setRevenueEarned] = useState(0);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <h1>Welcome, Admin</h1>
      <div className="admin-actions">
        <button onClick={() => handleNavigate('/manageItems')}>Manage Items</button>
        <button onClick={() => handleNavigate('/auctionReport')}>Auction Report</button>
        <button onClick={() => handleNavigate('/forensicsReport')}>Forensics Report</button>
      </div>
      <div className="dashboard-performance">
        <h2>Auction House Performance Overview</h2>
        <div className="performance-cards">
          <div className="performance-card">
            <h3>Items Published</h3>
            <p>{activeItemsCount}</p>
          </div>
          <div className="performance-card">
            <h3>Total Bids Placed</h3>
            <p>{totalBidsCount}</p> 
          </div>
          <div className="performance-card">
            <h3>Total Funds</h3>
            <p>{totalBidsAmount} USD</p> 
          </div>
          <div className="performance-card">
            <h3>Revenue Earned</h3>
            <p>{revenueEarned} USD </p> 
          </div>
          <Logout />
        </div>
      </div>
    </div>
  );
}
