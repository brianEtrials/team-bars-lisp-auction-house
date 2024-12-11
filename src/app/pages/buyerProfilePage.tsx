'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CloseAccount from './closeaccounts';
import Logout from './logout';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from  '../../../img/logo.png'

interface BuyerData {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    funds?: string;
}

interface ItemBidsView {
    item_ID: number;         // ID of the item
    iName: string;           // Name of the item
    iEndDate: string;    // Description of the item
    amount: number;          // Bid amount
    bidDate: string;         // Bid timestamp in YYYY-MM-DD format
    Winning: string;        // True if bidStatus is 1, False otherwise
  }
  

export default function BuyerProfilePage() {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize navigate
    const [getdata, setdata] = useState<BuyerData>({});
    const [inputValue, setInputValue] = useState('');
    const usernamedata = location.state?.username;

    const [buyerData, setbuyerData] = useState<BuyerData>({});

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [bids, setBids] = useState<ItemBidsView[]>([]);


    const fetchFunds = async () => {
        try {
            const response = await axios.get(
                'https://zcyerq8t8e.execute-api.us-east-1.amazonaws.com/review-profile',
                {
                    params: { username: usernamedata },
                }
            );
            const responseData =
                typeof response.data.body === 'string'
                    ? JSON.parse(response.data.body)
                    : response.data;
            setdata(responseData);
            
            
        } catch (error) {
            console.error('Failed to fetch funds:', error);
            alert('Failed to fetch funds');
            setdata({});
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const addAmount = async () => {
        const amountToAdd = parseFloat(inputValue);
        if (!isNaN(amountToAdd)) {
            try {
                await axios.post(
                    'https://tqqne0xyr2.execute-api.us-east-1.amazonaws.com/update-profile',
                    { usernamedata, funds: amountToAdd }
                );
                fetchFunds();
                setInputValue('');
                alert('Funds updated successfully!');
            } catch (error: any) {
                console.error('Failed to update funds:', error);
                alert('Failed to update funds. ' + error.message);
            }
        } else {
            alert('Please enter a valid number.');
        }
    };

    const fetchActiveBids = async () => {

        setLoading(true); //what is this??

        console.log("getdata.id check",getdata?.id) // not workin.
        console.log("username check",usernamedata) // working

        try {
            console.log("username check",usernamedata)
            const response = await fetch(
                'https://bprkevlvae.execute-api.us-east-1.amazonaws.com/review-active-bids/review-active-bids',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: usernamedata }),
                });
            
            console.log("username check",usernamedata)

            const responseData = await response.json();

            console.log("API response data:", responseData);

            if (typeof responseData.body === 'string') {
                const parsedBody = JSON.parse(responseData.body);
                setBids(parsedBody.biddata?.bids || []);
            } else {
                setBids(responseData.biddata?.bids || []);
            }
            console.log("username check",usernamedata)

        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }




    useEffect(() => {
        fetchFunds();
        fetchActiveBids();
    }, []);

    return (
        <div className="container mt-4">
            {/* Back Arrow Button */}
            <div className="mb-4">
                <button 
                    className="btn btn-primary" 
                    onClick={() => navigate("/buyer")} // Navigate to buyerItemsPage
                >
                    ← Back to Items
                </button>
            </div>
            <Logout />
            <h2>Buyer Profile</h2>
            <div className="card p-4">
                <p>
                    <strong>Name:</strong> {getdata?.first_name} {getdata?.last_name}
                </p>
                <p>
                    <strong>Email:</strong> {getdata?.email}
                </p>
                <div>
                    <p>
                        <strong>Current Funds:</strong> $
                        {getdata?.funds !== undefined ? getdata.funds : 'Loading...'}
                    </p>
                    <input
                        type="number"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter amount"
                        className="form-control"
                    />
                    <button
                        className="btn btn-primary mt-2"
                        onClick={addAmount}
                        disabled={isNaN(parseFloat(inputValue)) || inputValue === ''}
                    >
                        Add Funds
                    </button>
                </div>
            </div>
            <h3>Active Bids</h3>
            {loading ? (
                <p>Loading bids...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : bids.length > 0 ? (
                <table className="table table-bordered mt-4">
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Item Name</th>
                            <th>Auction End Date</th>
                            <th>Bid Amount</th>
                            <th>Bid Date</th>
                            <th>Winning</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bids.map((bid, index) => (
                            <tr key={index}>
                                <td>{bid.item_ID}</td>
                                <td>{bid.iName}</td>
                                <td>{bid.iEndDate}</td>
                                <td>${bid.amount}</td>
                                <td>{bid.bidDate}</td>
                                <td>{bid.Winning}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No active bids found.</p>
            )}

                    {/* Close Account Section */}
            <div className="card mt-4 p-4">
                <div style={{ width: '200px'}}>
                    <CloseAccount id={getdata?.id} />
                </div>
            </div>

            {/* Logout Section */}
            {/* <div className="card mt-4 p-4">
                <Logout />
            </div> */}
        </div>
    );
}
