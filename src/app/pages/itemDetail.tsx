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
  iType?: string;
  highestBid:string;
}

export default function ItemDetail() {
    const location = useLocation();
    const itemName = location.state.iName; //as string;
    const iImage = location.state.iImage; //as string;
    const itemDescription = location.state.iDescription; //as string;
    const iStartingPrice = location.state.iStartingPrice; //as string;
    const iStartDate = location.state.iStartDate; //as string;
    const iEndDate = location.state.iEndDate; //as string;
    const highestBid = location.state.highestBid;
    const iType = location.state.iType;
    const navigate = useNavigate();

    console.log("state received from customer page : ", itemName)

    return (
        <div>
          <div className="mb-4">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/")}
            >
              ← Back to Items
            </button>
          </div>
          <h1>{itemName}</h1>
          <img
            src={
              typeof iImage === 'string'
                ? iImage
                : URL.createObjectURL(iImage)
            }
            alt={itemName}
            style={{
              display: 'block',
              margin: '0 auto',
              maxHeight: '300px',
              objectFit: 'cover',
            }}
          />
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p><strong>Description:</strong> {itemDescription}</p>
            <p><strong>Price:</strong> ${iStartingPrice}</p>
            <p><strong>Start Date:</strong> {iStartDate || 'N/A'}</p>
            <p><strong>End Date:</strong> {iEndDate || 'N/A'}</p>
            <p><strong>Type:</strong> {iType || 'N/A'}</p>
          </div>
        </div>
      );
}
