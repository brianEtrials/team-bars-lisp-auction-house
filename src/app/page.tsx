'use client'
import React from 'react';
import AddItem from './add_item';
import FetchItemsComponent from './add_review_items';

export default function Page() {
  return (
    <div>
      <h1>AUCTION HOUSE</h1>

      <FetchItemsComponent />
    </div>
  );
}
