'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CloseAccount from './closeaccounts';
import Logout from './logout';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from  '../../../img/logo.png';
import secureLocalStorage from 'react-secure-storage';

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
    iEndDate: string;        // Description of the item
    amount: number;          // Bid amount
    bidDate: string;         // Bid timestamp in YYYY-MM-DD format
    Winning: string;         // True if bidStatus is 1, False otherwise
}

interface PreviousPurchases {
    transaction_id: number;
    seller_id: number;
    buyer_id: number;
    item_id: number;
    amount: number;
    transaction_time: string; // Use `string` for ISO date-time format
}

export default function BuyerProfilePage() {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize navigate
    const [getdata, setdata] = useState<BuyerData>({});
    const [inputValue, setInputValue] = useState('');
    const usernamedata = location.state?.username;
    const accountInfo_id = location.state?.id;
    console.log("ID : ",accountInfo_id)
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [bids, setBids] = useState<ItemBidsView[]>([]);
    const [previousPurchases, setPreviousPurchases] = useState<PreviousPurchases[]>([]);
    const [loadingPurchases, setLoadingPurchases] = useState<boolean>(true);

    // Fetch Funds
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

    // Add Funds
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const storedCredentials = secureLocalStorage.getItem("userCredentials");
    
    // Parse stored credentials if they are in JSON string format
    const pCredentials =
        typeof storedCredentials === "string"
            ? JSON.parse(storedCredentials)
            : storedCredentials;

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

    // Fetch Active Bids
    const fetchActiveBids = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                'https://bprkevlvae.execute-api.us-east-1.amazonaws.com/review-active-bids/review-active-bids',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: usernamedata }),
                });

            const responseData = await response.json();

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

    // Fetch Previous Purchases
    const fetchPreviousPurchases = async () => {
        setLoadingPurchases(true);
        try {
            const storedCredentials = secureLocalStorage.getItem("userCredentials");
    
            // Parse stored credentials if they are in JSON string format
            const parsedCredentials =
                typeof storedCredentials === "string"
                    ? JSON.parse(storedCredentials)
                    : storedCredentials;
    
            // Check if parsedCredentials is an object and has the id property
            if (parsedCredentials && typeof parsedCredentials === "object" && "id" in parsedCredentials) {
                const response = await axios.post(
                    'https://olie81hvk9.execute-api.us-east-1.amazonaws.com/reviewpurchases/reviewpurchases',
                    { buyer_ID: parsedCredentials.id },
                    { headers: { 'Content-Type': 'application/json' } }
                );
    
                const responseData =
                    typeof response.data.body === 'string'
                        ? JSON.parse(response.data.body)
                        : response.data;
    
                if (responseData.transactionData && responseData.transactionData.transactions) {
                    setPreviousPurchases(responseData.transactionData.transactions);
                } else {
                    setPreviousPurchases([]);
                }
            } else {
                console.error("Invalid stored credentials.");
                setPreviousPurchases([]);
            }
        } catch (error: any) {
            console.error('Failed to fetch previous purchases:', error);
        } finally {
            setLoadingPurchases(false);
        }
    };
    

    // useEffect to fetch data
    useEffect(() => {
        fetchFunds();
        fetchActiveBids();
        fetchPreviousPurchases();
    }, [getdata?.id]);

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

            {/* Previous Purchases Table */}
            <h3>Previous Purchases</h3>
            {loadingPurchases ? (
                <p>Loading purchases...</p>
            ) : previousPurchases.length > 0 ? (
                <table className="table table-bordered mt-4">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Seller ID</th>
                            <th>Item ID</th>
                            <th>Amount</th>
                            <th>Transaction Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {previousPurchases.map((purchase, index) => (
                            <tr key={index}>
                                <td>{purchase.transaction_id}</td>
                                <td>{purchase.seller_id}</td>   
                                <td>{purchase.item_id}</td>
                                <td>${purchase.amount.toFixed(2)}</td>
                                <td>{new Date(
    typeof purchase.transaction_time === 'number' && purchase.transaction_time < 10000000000 
      ? purchase.transaction_time * 1000 
      : purchase.transaction_time
  ).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No previous purchases found.</p>
            )}

            {/* Close Account Section */}
            <div className="card mt-4 p-4">
                <div style={{ width: '200px' }}>
                 <CloseAccount id={pCredentials.id} />  
                </div>
            </div>
        </div>
    );
}
