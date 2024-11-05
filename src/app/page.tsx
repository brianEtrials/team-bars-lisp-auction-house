'use client'
import React from 'react';
import FetchItemsComponent from './add_review_items';
import BuyerAccountPage from './buyerAccountPage';

export default function Page() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <img 
        src="https://raw.githubusercontent.com/brianEtrials/team-bars-lisp-auction-house/d8cd3cc21d5bbe1940b592642c33f3242bf75fb4/img/logo.png" 
        alt="Auction House Logo" 
        style={{ width: '50px', height: 'auto' }}
      />

      <FetchItemsComponent />
      {/* Comment the <FetchItemsComponent/> so as to just see the BuyerAccountPage*/}
      {/* If u uncomment the FetchItemsComponent and BuyerAccountPage will both be displayed on the same page */}
      <BuyerAccountPage /> 
    </div>
  );
}
