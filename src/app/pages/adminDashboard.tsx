'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logout from './logout';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeItemsCount, setActiveItemsCount] = useState(0);
  const [totalBidsCount, setTotalBidsCount] = useState(0); // New state for total bids count

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

        setActiveItemsCount(data.activeItemsCount);
        setTotalBidsCount(data.totalBidsCount); // Set total bids count
      } catch (error) {
        console.error('Failed to fetch auction metrics:', error);
      }
    };

    fetchAuctionMetrics();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <h1>Welcome, Admin</h1>
      <div className="admin-actions">
        <button onClick={() => handleNavigate('/manageItems')}>Manage Items</button>
        <button onClick={() => handleNavigate('/auctionReport')}>Auction Reports</button>
        <button onClick={() => handleNavigate('/forensicsReport')}>Forensics Reports</button>
      </div>
      <div className="dashboard-performance">
        <h2>Auction House Performance Overview</h2>
        <div className="performance-cards">
          <div className="performance-card">
            <h3>Total Items Published</h3>
            <p>{activeItemsCount}</p>
          </div>
          <div className="performance-card">
            <h3>Total Bids Placed</h3>
            <p>{totalBidsCount}</p> {/* Updated to display total bids count */}
          </div>
          <div className="performance-card">
            <h3>Total Funds</h3>
            <p>--</p> {/* Placeholder */}
          </div>
          <div className="performance-card">
            <h3>Revenue Earned</h3>
            <p>--</p> {/* Placeholder */}
          </div>
          <Logout />
        </div>
      </div>
    </div>
  );
}
