'use client'
import React, { useEffect, useState } from 'react';
import FetchItemsComponent from './add_review_items';

export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures we're on the client side
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {/* Conditionally render content after verifying client-side */}
      {isClient && (
        <img 
          src="https://raw.githubusercontent.com/brianEtrials/team-bars-lisp-auction-house/d8cd3cc21d5bbe1940b592642c33f3242bf75fb4/img/logo.png" 
          alt="Auction House Logo" 
          style={{ width: '50px', height: 'auto' }}
        />
      )}

      <FetchItemsComponent />
    </div>
  );
}
