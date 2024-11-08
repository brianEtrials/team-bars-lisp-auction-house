'use client';
import FetchItemsComponent from './pages/add_review_items';
import Accounts from './pages/accounts';
import BuyerAccountPage from './pages/buyerAccountPage';
import React from 'react';
import { Route, Routes } from "react-router-dom";

export default function Page() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Accounts />} />
        <Route path="/buyerAccountPage" element={<BuyerAccountPage />} />
        <Route path="/add_review_items" element={<FetchItemsComponent/>} />
      </Routes>
      </div>
  );
}