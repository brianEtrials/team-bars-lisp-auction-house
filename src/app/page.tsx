'use client'
import React from 'react';
import AddItem from './add_item';
import FetchItemsComponent from './add_review_items';

export default function Page() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <img 
        src="https://raw.githubusercontent.com/brianEtrials/team-bars-lisp-auction-house/d8cd3cc21d5bbe1940b592642c33f3242bf75fb4/img/logo.png" 
        alt="Auction House Logo" 
        style={{ width: '200px', height: 'auto' }}
      />

      <FetchItemsComponent />
    </div>
  );
}
