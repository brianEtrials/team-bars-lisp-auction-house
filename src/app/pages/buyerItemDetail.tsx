import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import logo from '../../../img/logo.png';
import secureLocalStorage from 'react-secure-storage';

interface Item {
  item_ID: number;
  iName: string;
  iDescription: string;
  iImage: string | File;
  iStartingPrice: number;
  iStartDate?: string;
  iEndDate?: string;
  iType: string;
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
  const [accountInfo, setAccountInfo] = useState(() => {
    return secureLocalStorage.getItem("userCredentials");
  });
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item.iType === 'Buy_Now') return; // Skip fetching bids for Buy_Now items

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

        // Handle stringified body
        if (typeof responseData.body === 'string') {
          const parsedBody = JSON.parse(responseData.body);
          setBids(parsedBody.biddata?.bids || []);
        } else {
          setBids(responseData.biddata?.bids || []);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [item.item_ID, item.iType]);

  return (
    <div style={{ padding: '20px' }}>
      <div className="mb-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/buyer")}
        >
          ← Back to Items
        </button>
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{item.iName}</h1>
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
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p><strong>Description:</strong> {item.iDescription}</p>
        <p><strong>Price:</strong> ${item.iStartingPrice}</p>
        <p><strong>Start Date:</strong> {item.iStartDate || 'N/A'}</p>
        <p><strong>End Date:</strong> {item.iEndDate || 'N/A'}</p>
      </div>

      {item.iType !== 'Buy_Now' && (
        <>
          <h2 style={{ textAlign: 'center', marginTop: '30px' }}>Bids</h2>
          {loading && <p style={{ textAlign: 'center' }}>Loading bids...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <div>
            {!loading && bids.length === 0 && (
              <p style={{ textAlign: 'center' }}>No bids found for this item.</p>
            )}
          </div>
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
        </>
      )}

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
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}