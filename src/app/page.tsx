// Ensure 'use client' is at the top to make this a client component
'use client';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accounts from './pages/accounts';
import BuyerItemsPage from './pages/buyerItemsPage';
import BuyerSoldItemsPage from './pages/soldItems';
import FetchItemsComponent from './pages/seller';
import CutomerPage from './pages/customer';
import ItemDetail from './pages/itemDetail';
import AdminDashboard from  './pages/adminDashboard';
import AdminLogin from './pages/adminLogin';
import ManageItems from './pages/manageItems';
import AuctionReport from './pages/auctionReport';
import BuyerItemDetail from './pages/buyerItemDetail';
import BuyerProfilePage from './pages/buyerProfilePage';
import SoldItemDetail from './pages/soldItemDetail';
import ForensicsReport from './pages/forensicsReport';

export default function Page() {
  const [isClient, setIsClient] = useState(false);

  // Enable client-only rendering to prevent SSR issues
  useEffect(() => {
    setIsClient(true); // Ensures this code only runs on the client
  }, []);

  if (!isClient) {
    // If on server, render nothing
    return null;
  }

  // Only one <BrowserRouter> in the app, defined here
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CutomerPage />} />
        <Route path="/ItemDetail" element={<ItemDetail/>}/>
        <Route path="/buyerItemDetail" element={<BuyerItemDetail />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/buyer" element={<BuyerItemsPage />} />
        <Route path="/buyer/soldItems" element={<BuyerSoldItemsPage />} />
        <Route path="/buyer/soldItem/detail" element={<SoldItemDetail/>}/>
        <Route path="/add_review_items" element={<FetchItemsComponent />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/manageItems" element={<ManageItems />} />
        <Route path="/auctionReport" element={<AuctionReport />} />
        <Route path="/buyer/ProfilePage" element={<BuyerProfilePage />} />
        <Route path="/forensicsReport" element={<ForensicsReport />} />
      </Routes>
    </BrowserRouter>
  );
}