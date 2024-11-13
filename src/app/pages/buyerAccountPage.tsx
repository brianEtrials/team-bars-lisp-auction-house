'use client'
import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';

interface BuyerData {
    first_name?: string;
    last_name?: string;
    email?: string;
    funds?: string;
}

export default function BuyerAccountPage() {
    // routing purpose
    const location = useLocation();
    const [getdata, setdata] = useState<BuyerData>({});
    const [inputValue, setInputValue] = useState('');
    const [redraw, forceRedraw] = React.useState(0)  
    const usernamedata = location.state.username as string;

      // Function to fetch items from the API
    const fetchFunds = async () => {
    try {
        console.log("Fetching username : ",usernamedata)
        const response = await axios.get('https://zcyerq8t8e.execute-api.us-east-1.amazonaws.com/review-profile', {
            params: { username: usernamedata }, // Explicitly send username as query parameter
          });
    
        const responseData = typeof response.data.body === 'string' ? JSON.parse(response.data.body) : response.data;
        setdata(responseData);
    } catch (error) {
        console.error("Request error:", error);
        alert("Failed to fetch funds");
        setdata({});
     }
    };
     // Fetch items when the component mounts
    useEffect(() => {
        fetchFunds();
    }, []);

    // utility method (that can be passed around) for refreshing display in React
    const andRefreshDisplay = () => {
        forceRedraw(redraw+1)
    }
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value );
    };


// updates the funds
    const addAmount = async () => {
        const amountToAdd = parseFloat(inputValue);
        if (!isNaN(amountToAdd)) {
            try {
              if (typeof usernamedata !== 'string' || !usernamedata.trim()) {
                throw new Error("Invalid email provided");
                }
                console.log("fetching the email: ", usernamedata)
                await axios.post('https://tqqne0xyr2.execute-api.us-east-1.amazonaws.com/update-profile', { 
                    usernamedata,funds: amountToAdd });
                fetchFunds();  // Update with the new total funds returned by the Lambda function
                setInputValue('');
                alert("Funds updated successfully!");
                andRefreshDisplay()
            } catch (error: any) {
                console.error("Failed to update funds:", error);
                alert("Failed to update funds. " + (error.response ? error.response.data : error.message));
            }
        } else {
            alert("Please enter a valid number.");
        }
    };

    return (
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] space-y-8">
                <label>Name: {getdata?.first_name} {getdata?.last_name}</label>
                <label>Email : {getdata?.email}</label>
                <div className="flex flex-col items-center space-y-4" id="design">
                    <label className="funds">{"Current Funds: $" + (getdata?.funds !== undefined ? getdata.funds : 'Loading...')}</label>
                    <input 
                        type="number" 
                        value={inputValue} 
                        onChange={handleInputChange} 
                        placeholder="Enter amount"
                    />
                    <button 
                        className="Add" 
                        onClick={addAmount} 
                        disabled={isNaN(parseFloat(inputValue)) || inputValue === ''}
                    >
                        Add Funds
                    </button>
                </div>
            </div>
        </main>
    );
}