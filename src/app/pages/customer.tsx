import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

interface Item {
  item_ID: number;
  iName: string;
  iDescription: string;
  iImage: string | File;
  iStartingPrice: number;
  iStartDate?: string;
  iEndDate?: string;
}

export default function CustomerPage() {
  const [items, setItems] = useState<Item[]>([]);
  const navigate = useNavigate();
  const fetchItemData = async () => {
    try {
      const response = await axios.get(
        'https://qw583oxspk.execute-api.us-east-1.amazonaws.com/cutomer-view/customerView'
      );
  
      console.log('Raw Response:', response);
  
      // Parse the body if it's a string (e.g., when using AWS Lambda)
      const responseData = typeof response.data.body === 'string'
        ? JSON.parse(response.data.body)
        : response.data;
  
      console.log('Parsed Response Data:', responseData);
  
      // Accessing items inside itemdata
      if (responseData && responseData.itemdata && Array.isArray(responseData.itemdata.items)) {
        setItems(responseData.itemdata.items);
        console.log('Items Set Successfully:', responseData.itemdata.items);
      } else {
        console.warn('Unexpected Data Structure:', responseData);
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]); // Reset to empty array on error
    }
  };
  
  const signpage = () =>{
    navigate("/accounts"); // Pass state here

  }

  const itemdetail =(selecteditems)=>{
    // Store account info securely in localStorage after account creation
    console.log("item detail stage inside the customer page check: ",selecteditems)
    navigate("/ItemDetail",{state:{ ...selecteditems}})
  }
  
  // Fetch data on component mount
  useEffect(() => {
    fetchItemData();
  }, []);

  // Debugging to confirm state after data is fetched
  useEffect(() => {
    console.log('Current items state:', items);
  }, [items]);

  return (
    <div className="container mt-4">
      <button id ="signin" onClick={signpage}>Sign in</button>
      <h2>Items</h2>
      <div className="row">
        {items.length > 0 ? (
          items.map((items, index) => (
            <div key={index} className="col-lg-3  col-md-6 col-sm-11 mb-4">
              <div onClick={() => itemdetail(items)} className="card h-100">
                <img
                  src={
                    typeof items.iImage === 'string'
                      ? items.iImage
                      : URL.createObjectURL(items.iImage)
                  }
                  className="card-img-top"
                  alt={items.iName}
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title" >{items.iName}</h5>
                  <p className="card-text">{items.iDescription}</p>
                  <p><strong>Starting Price:</strong> ${items.iStartingPrice}</p>
                  <p><strong>Start Date:</strong> {items.iStartDate || 'N/A'}</p>
                  <p><strong>End Date:</strong> {items.iEndDate || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No items available</p>
        )}
      </div>
    </div>
  );
}
