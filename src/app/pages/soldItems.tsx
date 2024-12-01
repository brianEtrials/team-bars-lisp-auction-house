'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import profile from '../../../img/profile_page.png'
import Logout from './logout';
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

export default function BuyerSoldItemsPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [startDateSortOrder, setStartDateSortOrder] = useState<'asc' | 'desc'>('asc');
    const [endDateSortOrder, setEndDateSortOrder] = useState<'asc' | 'desc'>('asc');
    const navigate = useNavigate();

    const fetchItems = async () => {
        try {
            const response = await axios.get(
                'https://2tmp7ig1t2.execute-api.us-east-1.amazonaws.com/soldItemView/soldItemView'
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

    useEffect(() => {
        fetchItems();
    }, []);

    const viewItemDetails = (selectedItem: Item) => {
        navigate("/buyer/soldItem/detail", { state: { ...selectedItem } });
    };

    const goToProfile = () => {
        // Retrieve the stored user credentials
        const storedCredentials = secureLocalStorage.getItem("userCredentials");
      
        if (storedCredentials) {
          let parsedCredentials;
          
          // Check if the value is a string (i.e., needs to be parsed)
          if (typeof storedCredentials === 'string') {
            try {
              parsedCredentials = JSON.parse(storedCredentials);
            } catch (error) {
              console.error("Failed to parse user credentials:", error);
              alert("Failed to retrieve user information. Please log in again.");
              return;
            }
          } else {
            // If it's already an object, use it directly
            parsedCredentials = storedCredentials;
          }
      
          const loggedInUsername = parsedCredentials?.username;
      
          if (loggedInUsername) {
            navigate("/buyer/ProfilePage", { state: { username: loggedInUsername } });
          } else {
            alert("Username not found.");
          }
        } else {
          alert("Please log in first");
        }
      };      


      const activeItems = () => {
        // Retrieve the stored user credentials
        const storedCredentials = secureLocalStorage.getItem("userCredentials");
      
        if (storedCredentials) {
          let parsedCredentials;
          
          // Check if the value is a string (i.e., needs to be parsed)
          if (typeof storedCredentials === 'string') {
            try {
              parsedCredentials = JSON.parse(storedCredentials);
            } catch (error) {
              console.error("Failed to parse user credentials:", error);
              alert("Failed to retrieve user information. Please log in again.");
              return;
            }
          } else {
            // If it's already an object, use it directly
            parsedCredentials = storedCredentials;
          }
      
          const loggedInUsername = parsedCredentials?.username;
      
          if (loggedInUsername) {
            navigate("/buyer", { state: { username: loggedInUsername } });
        } else {
            alert("Username not found.");
          }
        } else {
          alert("Please log in first");
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
        <div className="container mt-4">
            {/* Button to Profile Page */}
            <div className="mb-4">
            <img src={profile.src} onClick={goToProfile} width="30px" height="30px" className="position-absolute top-7 end-36" title="profile page"/>
            <Logout />
            <Button onClick={activeItems}>Active Items</Button>
            </div>

            {/* Search and Sort Section */}
            {/* <div className="card p-4"> */}
                <Form>
                    <InputGroup className="mb-3">
                        <Form.Control
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search items"
                        />
                    </InputGroup>
                </Form>
                <div className="d-flex justify-content-center gap-3">
                <Button className="btn btn-secondary" variant="primary" onClick={handleSortByPrice}>
                        Sort by Price ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
                    </Button>
                    <Button className="btn btn-secondary" variant="primary" onClick={handleSortByStartDate}>
                        Sort by Start Date ({startDateSortOrder === 'asc' ? 'Low to High' : 'High to Low'})
                    </Button>
                    <Button className="btn btn-secondary" variant="primary" onClick={handleSortByEndDate}>
                        Sort by End Date ({endDateSortOrder === 'asc' ? 'Low to High' : 'High to Low'})
                    </Button>
                </div>
            {/* </div> */}

            {/* Items Section */}
            <div className="mt-4">
                <h3>Sold Items in the last 24 hours</h3>
                <div className="row">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <div
                                key={index}
                                className="col-lg-3 col-md-6 col-sm-11 mb-4"
                                onClick={() => viewItemDetails(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="card h-100 border-secondary rounded-0 p-3">
                                    <img
                                        src={
                                            typeof item.iImage === "string"
                                                ? item.iImage
                                                : URL.createObjectURL(item.iImage)
                                        }
                                        className="card-img-top border-0 rounded-0"
                                        alt={item.iName}
                                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.iName}</h5>
                                        <p className="card-text">{item.iDescription}</p>
                                        <p><strong>Price:</strong> ${item.iStartingPrice}</p>
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
        </div>
    );
}
