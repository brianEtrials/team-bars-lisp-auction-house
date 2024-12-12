'use client';

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import logo from  '../../../img/logo.png'
import axios from 'axios';


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
  const navigate = useNavigate(); // Initialize navigate
  const item = location.state as Item;
  const usernamedata = location.state?.loggedInUsername;
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const [highestBid, setHighestBid] = useState<number | null>(null);

  console.log("location: ", location)
  console.log("location.state: ", location.state)
  console.log("location.state?.username: " , location.state?.username)
  console.log("usernamedata: ", usernamedata)

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
      console.log("API response data:", responseData);

      // Handle stringified body
      let parsedBids = [];
      if (typeof responseData.body === 'string') {
        const parsedBody = JSON.parse(responseData.body);
        setBids(parsedBody.biddata?.bids || []);
        parsedBids = parsedBody.biddata?.bids || [];
      } else {
        setBids(responseData.biddata?.bids || []);
        parsedBids = responseData.biddata?.bids || [];
      }

      const maxBid = parsedBids.reduce((max: number, bid: Bid) => Math.max(max, bid.amount), 0);
      setHighestBid(maxBid);


    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchBids();
  }, [item.item_ID]);
  
  console.log("Bids state after fetching:", bids);


  const biditem = async () => {
    const amountToAdd = parseFloat(inputValue);
    console.log("bid amount : ",amountToAdd)
    const item_ID = item.item_ID
    console.log("username : ", usernamedata)
    console.log("item Id : ",item_ID)
    if (!isNaN(amountToAdd)) {
        try {
            await axios.post(
                'https://65jqn0vcg4.execute-api.us-east-1.amazonaws.com/placebid/placebid',
                { usernamedata,item_ID,funds: amountToAdd }
            );
            
            //console.log("response.data.data.statusCode: ", response.data.data.statusCode)
            //console.log("response.status: ", response.status)

            //if (response.status === 200) {
              setInputValue('');
              alert('Bid made successfully!');
              fetchBids();
            //} else {
             // console.error("Unexpected response:", response);
            //}

        } catch (error: any) {
            console.error('Failed to update bid:', error);
            alert('Failed to update funds. ' + error.message);
            //if (error.response) {
              //console.error("Server responded with an error:", error.response);
              //const errorMessage = JSON.parse(error.response.data.body)?.message || "An error occurred.";
             // alert(errorMessage);
            //} else {
             // console.error("Error making the request:", error);
              //alert("Failed to place bid. Please check your connection and try again.");
            }
        
    } else {
        alert('Please enter a valid number.');
    }
    
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
};



  return (
    <div style={{ padding: '20px' }}>
      {/* Back Arrow Button */}
      <div className="mb-4">
        <button 
          className="btn btn-primary" 
          onClick={() => navigate("/buyer")} // Navigate to buyerItemsPage
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

      <h2 style={{ textAlign: 'center', marginTop: '30px' }}>Bids</h2>
      {loading && <p style={{ textAlign: 'center' }}>Loading bids...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {!loading && bids.length === 0 && <p style={{ textAlign: 'center' }}>No bids found for this item.</p>}

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

      {/* BID Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {/* // style={{
          //   backgroundColor: '#cccccc',
          //   color: '#fff',
          //   padding: '10px 20px',
          //   border: 'none',
          //   borderRadius: '5px',
          //   cursor: 'not-allowed',
          //   fontSize: '16px',
          // }} */}
        
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter amount. (To enter amount use the tiny up 'n' down arrows on the far right or mouse wheel.)"
          className="form-control"
          min={highestBid !== null ? highestBid + 1 : item.iStartingPrice + 1}
          step='1'
          onKeyDown={(e) => e.preventDefault()}
      />
        <button
            className="btn btn-primary mt-2"
            onClick={biditem}
            disabled={
              isNaN(parseFloat(inputValue)) ||
              parseFloat(inputValue) < (highestBid !== null && highestBid > 0 ? highestBid + 1 : item.iStartingPrice + 1)
            }
        >BID
          </button>
      </div>
    </div>
  );
}
