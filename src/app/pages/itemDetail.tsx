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
}

export default function ItemDetail() {
    const location = useLocation();
    const itemName = location.state.iName; //as string;
    const iImage = location.state.iImage; //as string;
    const itemDescription = location.state.iDescription; //as string;
    const iStartingPrice = location.state.iStartingPrice; //as string;
    const iStartDate = location.state.iStartDate; //as string;
    const iEndDate = location.state.iEndDate; //as string;
    const iType = location.state.iType;

    console.log("state received from customer page : ", itemName)

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
          <p><strong>Type:</strong> {iType || 'N/A'}</p>
        </div>
      );
}
