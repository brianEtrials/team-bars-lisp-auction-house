'use client';

import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import CloseAccount from './closeaccounts';
import Logout from './logout';
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

interface Item {
    item_ID: number;
    iName: string;
    iDescription: string;
    iImage: string | File;
    iStartingPrice: number;
    iStartDate?: string;
    iEndDate?: string;
}

interface BuyerData {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    funds?: string;
}

export default function BuyerAccountPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [startDateSortOrder, setStartDateSortOrder] = useState<'asc' | 'desc'>('asc');
    const [endDateSortOrder, setEndDateSortOrder] = useState<'asc' | 'desc'>('asc');
    const navigate = useNavigate();
    const location = useLocation();
    const [getdata, setdata] = useState<BuyerData>({});
    const [inputValue, setInputValue] = useState('');
    const usernamedata = location.state.username as string;
    const accountInfo = location.state;

    const fetchItems = async () => {
        try {
            const response = await axios.get(
                'https://qw583oxspk.execute-api.us-east-1.amazonaws.com/cutomer-view/customerView'
            );
            const responseData = typeof response.data.body === 'string'
                ? JSON.parse(response.data.body)
                : response.data;

            if (responseData && responseData.itemdata && Array.isArray(responseData.itemdata.items)) {
                setItems(responseData.itemdata.items);
            } else {
                console.warn('Unexpected Data Structure:', responseData);
                setItems([]);
            }
        } catch (error) {
            console.error('Failed to fetch items:', error);
            setItems([]);
        }
    };

    const fetchFunds = async () => {
        try {
            const response = await axios.get('https://zcyerq8t8e.execute-api.us-east-1.amazonaws.com/review-profile', {
                params: { username: usernamedata },
            });

            const responseData = typeof response.data.body === 'string' ? JSON.parse(response.data.body) : response.data;
            setdata(responseData);
        } catch (error) {
            console.error("Request error:", error);
            alert("Failed to fetch funds");
            setdata({});
        }
    };

    useEffect(() => {
        fetchItems();
        fetchFunds();
    }, []);

    const viewItemDetails = (selectedItem: Item) => {
        navigate("/buyerItemDetail", { state: { ...selectedItem } });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const addAmount = async () => {
        const amountToAdd = parseFloat(inputValue);
        if (!isNaN(amountToAdd)) {
            try {
                await axios.post('https://tqqne0xyr2.execute-api.us-east-1.amazonaws.com/update-profile', {
                    usernamedata, funds: amountToAdd
                });
                fetchFunds();
                setInputValue('');
                alert("Funds updated successfully!");
            } catch (error: any) {
                console.error("Failed to update funds:", error);
                alert("Failed to update funds. " + (error.response ? error.response.data : error.message));
            }
        } else {
            alert("Please enter a valid number.");
        }
    };

    const handleSortByPrice = () => {
        const sorted = [...items].sort((a, b) => {
            return sortOrder === 'asc'
                ? a.iStartingPrice - b.iStartingPrice
                : b.iStartingPrice - a.iStartingPrice;
        });
        setItems(sorted);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleSortByStartDate = () => {
        const sorted = [...items].sort((a, b) => {
            const dateA = new Date(a.iStartDate || '').getTime();
            const dateB = new Date(b.iStartDate || '').getTime();
            return startDateSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setItems(sorted);
        setStartDateSortOrder(startDateSortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleSortByEndDate = () => {
        const sorted = [...items].sort((a, b) => {
            const dateA = new Date(a.iEndDate || '').getTime();
            const dateB = new Date(b.iEndDate || '').getTime();
            return endDateSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setItems(sorted);
        setEndDateSortOrder(endDateSortOrder === 'asc' ? 'desc' : 'asc');
    };

    const filteredItems = items.filter((item) => {
        return search.toLowerCase() === ''
            ? item
            : item.iName.toLowerCase().includes(search) ||
              item.iDescription.toLowerCase().includes(search) ||
              item.iStartingPrice.toString().includes(search);
    });

    return (
        <div className="container">
            {/* Buyer Information and Funds Section */}
            <div className="card mt-4 p-4">
                <h3>Buyer Information</h3>
                <p><strong>Name:</strong> {getdata?.first_name} {getdata?.last_name}</p>
                <p><strong>Email:</strong> {getdata?.email}</p>
                <div>
                    <p><strong>Current Funds:</strong> ${getdata?.funds ?? 'Loading...'}</p>
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
            {/* Search and Sorting Section */}
            <div className="card mt-4 p-4">
                <h3>Search and Sort Items</h3>
                <Form>
                    <InputGroup className="mb-3">
                        <Form.Control
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search items"
                        />
                    </InputGroup>
                </Form>
                <div>
                    <Button className="m-1" variant="primary" onClick={handleSortByPrice}>
                        Sort by Price ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
                    </Button>
                    <Button className="m-1" variant="primary" onClick={handleSortByStartDate}>
                        Sort by Start Date ({startDateSortOrder === 'asc' ? 'Low to High' : 'High to Low'})
                    </Button>
                    <Button className="m-1" variant="primary" onClick={handleSortByEndDate}>
                        Sort by End Date ({endDateSortOrder === 'asc' ? 'Low to High' : 'High to Low'})
                    </Button>
                </div>
            </div>

            {/* Items Section */}
            <div className="mt-4">
                <h3>Available Items</h3>
                <div className="row">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <div
                                key={index}
                                className="col-lg-3 col-md-6 col-sm-11 mb-4"
                                onClick={() => viewItemDetails(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="card h-100">
                                    <img
                                        src={
                                            typeof item.iImage === "string"
                                                ? item.iImage
                                                : URL.createObjectURL(item.iImage)
                                        }
                                        className="card-img-top"
                                        alt={item.iName}
                                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.iName}</h5>
                                        <p className="card-text">{item.iDescription}</p>
                                        <p><strong>Starting Price:</strong> ${item.iStartingPrice}</p>
                                        <p><strong>Start Date:</strong> {item.iStartDate || 'N/A'}</p>
                                        <p><strong>End Date:</strong> {item.iEndDate || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No items available</p>
                    )}
                </div>
            </div>

            {/* Close Account Button */}
            <div className="card mt-4 p-4">
                <CloseAccount id={accountInfo.idaccounts} />
            </div>
            <div className="card mt-4 p-4">
                <Logout />
            </div>
        </div>
    );
}
