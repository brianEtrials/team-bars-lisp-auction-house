'use client';

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';

interface Item {
  item_ID: number;
  iName: string;
  iDescription: string;
  iImage: string | File;
  iStartingPrice: number;
  iStartDate?: string;
  iEndDate?: string;
  iType: string;     // 'Auction' or 'Buy_Now'
  iStatus: string;
  highestBid:string;
}

interface Bid {
  bid_ID: number;
  buyer_ID: number;
  item_ID: number;
  amount: number;
  bidTimestamp: string;
}

export default function BuyerItemDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state as Item;

  // If you store user info securely, e.g. in react-secure-storage:
  const [accountInfo, setAccountInfo] = useState<{
    username: string;
    funds: number;
  } | null>(() => {
    return secureLocalStorage.getItem("userCredentials") as
      | { username: string; funds: number }
      | null;
  });

  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // For the bidding UI
  const [inputValue, setInputValue] = useState('');
  const [highestBid, setHighestBid] = useState<number | null>(null);


   //1. FETCH BIDS (only if iType !== 'Buy_Now')

  const fetchBids = async () => {
    if (!item.item_ID) {
      setError("Invalid item_ID provided.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://5brq4rlzdh.execute-api.us-east-1.amazonaws.com/read-item-bids/read-item-bids`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ item_ID: item.item_ID }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bids: ${response.statusText}`);
      }

      const responseData = await response.json();
      let parsedBids: Bid[] = [];

      if (typeof responseData.body === 'string') {
        // If the Lambda returns a stringified JSON in 'body'
        const parsedBody = JSON.parse(responseData.body);
        parsedBids = parsedBody.biddata?.bids || [];
      } else {
        // If the response is already an object
        parsedBids = responseData.biddata?.bids || [];
      }

      setBids(parsedBids);

      // Calculate highest bid
      const maxBid = parsedBids.reduce((max: number, bid: Bid) => {
        return Math.max(max, bid.amount);
      }, 0);
      setHighestBid(maxBid || null);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (item.iType !== 'Buy_Now') {
      fetchBids();
    } else {
      setLoading(false);
    }
  }, [item.item_ID, item.iType]);


   //2. PLACE A BID (Auction scenario)

  const bidItem = async () => {
    if (!accountInfo) {
      alert("Error: Must be logged in to place a bid.");
      return;
    }

    const amountToAdd = parseFloat(inputValue);
    if (!item.item_ID || isNaN(amountToAdd)) {
      alert('Please enter a valid bid amount.');
      return;
    }


    try {
      const response = await axios.post(
        'https://65jqn0vcg4.execute-api.us-east-1.amazonaws.com/placebid/placebid',
        {
          usernamedata: accountInfo.username,
          item_ID: item.item_ID,
          funds: amountToAdd,
        }
      );

      console.log("response: ", response);
      const alertMessage = JSON.parse(response.data.body);
      alert(alertMessage.message);

      // Clear the input
      setInputValue('');

      // Refresh the bids list
      fetchBids();
    } catch (error: any) {
      console.error('Failed to place bid:', error);
      alert('Failed to place bid. ' + error.message);
    }
  };


   // 3. BUY NOW (Buy_Now scenario)

  const handleBuyNow = async () => {
    if (!accountInfo) {
      alert("Error: Must be logged in to purchase.");
      return;
    }

    try {
      // 3A. Place a “bid” for the full Buy_Now price.
      const response = await axios.post(
        'https://65jqn0vcg4.execute-api.us-east-1.amazonaws.com/placebid/placebid',
        {
          usernamedata: accountInfo.username,
          item_ID: item.item_ID,
          funds: item.iStartingPrice,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Bid placed successfully:', response.data);

      const alertMessage = JSON.parse(response.data.body);

      alert(alertMessage.message);
      // 3B. Complete the purchase by calling another endpoint.
      if (alertMessage !== `Buyer has insufficient funds.`) {
        try {
          const buyNowResponse = await axios.post(
            'https://ib158fhn7a.execute-api.us-east-1.amazonaws.com/buynow/buynow',
            { item_ID: item.item_ID },
            { headers: { 'Content-Type': 'application/json' } }
          );
          console.log('Purchase completed successfully:', buyNowResponse.data);
          //alert('Item purchased successfully!');
          navigate("/buyer");
        } catch (err: any) {
          console.error('Failed to complete the purchase:', err.message);
          alert('Failed to complete the purchase: ' + err.message);
        }}

    } catch (err: any) {
      console.error('Failed to place a buy-now bid:', err.message);
      alert('Failed to place a buy-now: ' + err.message);
    }




  };


   // 4. RENDERING

  let minBid = 0;
  let isFirstBid = bids.length === 0;
  if (isFirstBid) {
    // First bid must be exactly the starting price
    minBid = item.iStartingPrice;
  } else {
    // Subsequent bids must exceed the highest bid
    minBid = (highestBid ?? 0) + 1;
  }


  useEffect(() => {
    if (item.iType !== 'Buy_Now' && bids.length === 0) {
      setInputValue(item.iStartingPrice.toString());
    }
  }, [bids, item.iType, item.iStartingPrice]);

  return (
    <div style={{ padding: '20px' }}>
      {/* Back Button */}
      <div className="mb-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/buyerItemDetail")}
        >
          ← Back to Items
        </button>
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {item.iName}
      </h1>

      {/* Item Image */}
      <img
        src={
          typeof item.iImage === 'string'
            ? item.iImage
            : URL.createObjectURL(item.iImage)
        }
        alt={item.iName}
        style={{
          display: 'block',
          margin: '0 auto',
          maxHeight: '300px',
          objectFit: 'cover',
        }}
      />

      {/* Item Details */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p><strong>Description:</strong> {item.iDescription}</p>
        <p><strong>Price:</strong> ${item.highestBid}</p>
        <p><strong>Start Date:</strong> {item.iStartDate || 'N/A'}</p>
        <p><strong>End Date:</strong> {item.iEndDate || 'N/A'}</p>
      </div>

      {/* Auction / Bids Section */}
      {item.iType !== 'Buy_Now' && (
        <>
          <h2 style={{ textAlign: 'center', marginTop: '30px' }}>{item.iType === "Buy_Now" ? "Buy Now" : "Place Bid"}</h2>
          {loading && <p style={{ textAlign: 'center' }}>Loading bids...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          {/* If there are no bids */}
          {!loading && bids.length === 0 && (
            <p style={{ textAlign: 'center' }}>
              No bids found for this item. 
              <br />
              <strong>The first bid must be ${item.iStartingPrice}.</strong>
            </p>
          )}

          {/* Display bids */}
          {!loading && bids.length > 0 && (
            <div style={{ margin: '30px auto', maxWidth: '80%' }}>
              <table
                style={{
                  width: '100%',
                  textAlign: 'center',
                  borderCollapse: 'collapse',
                  border: '1px solid #ddd',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f4f4f4', fontWeight: 'bold' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Bid ID</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Buyer ID</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Amount ($)</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid) => (
                    <tr key={bid.bid_ID}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{bid.bid_ID}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{bid.buyer_ID}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{bid.amount}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{bid.bidTimestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Bid Input & Button */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter bid amount"
              className="form-control"
              min={minBid}
              step="1"
              // Disable the input if it's the first bid (so it cannot be changed)
              disabled={isFirstBid}
            />
            <button
              className="btn btn-primary mt-2"
              onClick={bidItem}
              disabled={
                isNaN(parseFloat(inputValue)) ||
                parseFloat(inputValue) < minBid
              }
            >
              Place Bid
            </button>
          </div>
        </>
      )}

      {/* Buy Now Button (if iType === 'Buy_Now') */}
      {item.iType === 'Buy_Now' && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}
