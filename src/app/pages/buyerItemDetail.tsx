import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

interface Item {
  item_ID: number;
  iName: string;
  iDescription: string;
  iImage: string | File;
  iStartingPrice: number;
  iStartDate?: string;
  iEndDate?: string;
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
  const item = location.state as Item;

  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch bids from Lambda function
    const fetchBids = async () => {
      try {
        const response = await fetch(`https://op26w7lak0.execute-api.us-east-1.amazonaws.com/readItemBids/readItemBids`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ item_ID: item.item_ID }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch bids: ${response.statusText}`);
        }

        const data = await response.json();
        setBids(data.biddata.bids);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [item.item_ID]);

  return (
    <div>
      <h1>{item.iName}</h1>
      <img
        src={
          typeof item.iImage === 'string'
            ? item.iImage
            : URL.createObjectURL(item.iImage)
        }
        alt={item.iName}
        style={{ maxHeight: '200px', objectFit: 'cover' }}
      />
      <p><strong>Description:</strong> {item.iDescription}</p>
      <p><strong>Starting Price:</strong> ${item.iStartingPrice}</p>
      <p><strong>Start Date:</strong> {item.iStartDate || 'N/A'}</p>
      <p><strong>End Date:</strong> {item.iEndDate || 'N/A'}</p>

      <h2>Bids</h2>
      {loading && <p>Loading bids...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && bids.length === 0 && <p>No bids found for this item.</p>}
      <ul>
        {bids.map((bid) => (
          <li key={bid.bid_ID}>
            <p><strong>Bid ID:</strong> {bid.bid_ID}</p>
            <p><strong>Buyer ID:</strong> {bid.buyer_ID}</p>
            <p><strong>Amount:</strong> ${bid.amount}</p>
            <p><strong>Timestamp:</strong> {bid.bidTimestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
