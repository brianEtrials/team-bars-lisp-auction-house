import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
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
  bid_ID: number;          // Primary Key, Auto-Increment
  buyer_ID: number;        // Foreign Key linking to idaccounts(accounts table)
  item_ID: number;         // Foreign Key linking to the item_ID(items table)
  amount: number;          // The bid amount
  bidTimestamp: string;      // The timestamp of the bid
  bidStatus: boolean;      // Status of the bid (0 or 1, converted to boolean)
}


export default function ItemDetail() {
    const location = useLocation();
    const itemName = location.state.iName; //as string;
    const iImage = location.state.iImage; //as string;
    const itemDescription = location.state.iDescription; //as string;
    const iStartingPrice = location.state.iStartingPrice; //as string;
    const iStartDate = location.state.iStartDate; //as string;
    const iEndDate = location.state.iEndDate; //as string;
    
    const itemID = location.state.item_ID; // number
    if (!itemID) {
      console.error("item_ID is missing");
      return null; // Or handle the error appropriately
    }

    console.log("state received from customer page : ", itemName)

    const [bids, setBids] = useState<Bid[]>([]);
    const [highestBid, setHighestBid] = useState<Bid | null>(null); // To track the highest bid

    const fetchBidData = async () => {
      try {
        const response = await axios.get('', {params: { item_ID: itemID },});

        console.log('Raw Response:', response);

        // Parse the body if it's a string (e.g., when using AWS Lambda)
        const responseData = typeof response.data.body === 'string'
          ? JSON.parse(response.data.body)
          : response.data;
    
        console.log('Parsed Response Data:', responseData);
    
        // Accessing bids inside biddata
        if (responseData && responseData.biddata && Array.isArray(responseData.biddata.bids)) {
          setBids(responseData.biddata.bids);
          console.log('Bids Set Successfully:', responseData.biddata.bids);
          const maxBid = bids.reduce((prev, current) => (current.amount > prev.amount ? current : prev), bids[0]);
          setHighestBid(maxBid); // Set the highest bid in state
          console.log('Highest Bid Set Successfully:', maxBid);

        } else {
          console.warn('Unexpected Data Structure:', responseData);
          setBids([]);
          setHighestBid(null);
        }
      } catch (error) {
        console.error('Failed to fetch bidss:', error);
        setBids([]); // Reset to empty array on error
        setHighestBid(null);
      }

      
    };

    useEffect(() => {
      fetchBidData();
    }, []);

    // Debugging to confirm state after data is fetched
    useEffect(() => {
      console.log('Current items state:', bids);
      }, [bids]);

    return (
        <div>
          <h1>{itemName}</h1>
          <img
            src={
              typeof iImage === 'string'
                ? iImage
                : URL.createObjectURL(iImage)
            }
            alt={itemName}
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
          <p><strong>Description:</strong> {itemDescription}</p>
          <p><strong>Starting Price:</strong> ${iStartingPrice}</p>
          <p><strong>Start Date:</strong> {iStartDate || 'N/A'}</p>
          <p><strong>End Date:</strong> {iEndDate || 'N/A'}</p>
          {highestBid ? (
          <div className="mt-4">
            <h2>Highest Bid</h2>
            <p><strong>Bid Amount:</strong> ${highestBid.amount}</p>
            <p><strong>Bidder ID:</strong> {highestBid.buyer_ID}</p>
            <p><strong>Bid Time:</strong> {highestBid.bidTimestamp}</p>
          </div>
        ) : (
          <p>No bids for this item.</p>
        )}
        </div>
      );
}
