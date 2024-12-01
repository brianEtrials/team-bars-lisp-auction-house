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

export default function BuyerProfilePage() {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize navigate
    const [getdata, setdata] = useState<BuyerData>({});
    const [inputValue, setInputValue] = useState('');
    const usernamedata = location.state?.username;

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

    useEffect(() => {
        fetchFunds();
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
