'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BuyerAccountPage() {
    const [getdata, setdata] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [redraw, forceRedraw] = React.useState(0)  

      // Function to fetch items from the API
    const fetchFunds = async () => {
    try {
        const response = await axios.get('https://zcyerq8t8e.execute-api.us-east-1.amazonaws.com/review-profile');
        // setFunds(response.data.funds);
        
        const responseData = typeof response.data.body === 'string' ? JSON.parse(response.data.body) : response.data;
        // Access the items array and set it in the state
        console.log("API Response:", responseData);
        // setFunds(responseData.funds || []);
        setdata(responseData); // Set funds as the entire response data object
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error("Response error:", error.response.status, error.response.data);
            alert(`Failed to fetch funds: ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
            // Request was made but no response received
            console.error("Request error:", error.request);
            alert("No response received from server. Check network and API configuration.");
        } else {
            // Something happened in setting up the request
            console.error("Network error:", error.message);
            alert("Network error: " + error.message);
        }
        // setFunds([]);
        setdata({});
    }
    }
     // Fetch items when the component mounts
  useEffect(() => {
    fetchFunds();
  }, []);

    // utility method (that can be passed around) for refreshing display in React
    const andRefreshDisplay = () => {
        forceRedraw(redraw+1)
    }
  
  const handleInputChange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };


// updates the funds
    const addAmount = async () => {
        const amountToAdd = parseFloat(inputValue);
        if (!isNaN(amountToAdd)) {
            try {
                // Send only the amount to add, not the calculated total
                const response = await axios.post('https://tqqne0xyr2.execute-api.us-east-1.amazonaws.com/update-profile', { funds: amountToAdd });
                fetchFunds();  // Update with the new total funds returned by the Lambda function
                setInputValue('');
                alert("Funds updated successfully!");
                andRefreshDisplay()
            } catch (error) {
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
                        onChange={(e) => setInputValue(e.target.value)} 
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



