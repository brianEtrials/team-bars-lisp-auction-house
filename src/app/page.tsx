// Ensure 'use client' is at the top to make this a client component
'use client';

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accounts from './pages/accounts';
import BuyerAccountPage from './pages/buyerAccountPage';
import FetchItemsComponent from './pages/seller';

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
        <Route path="/" element={<Accounts />} />
        <Route path="/buyerAccountPage" element={<BuyerAccountPage />} />
        <Route path="/add_review_items" element={<FetchItemsComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

// 'use client';
// import FetchItemsComponent from './pages/seller';
// import Accounts from './pages/accounts';
// import BuyerAccountPage from './pages/buyerAccountPage';
// import React from 'react';
// import { Route, Routes } from "react-router-dom";

// export default function Page() {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Accounts />} />
//         <Route path="/buyerAccountPage" element={<BuyerAccountPage />} />
//         <Route path="/add_review_items" element={<FetchItemsComponent/>} />
//       </Routes>
//       </div>
//   );
// }