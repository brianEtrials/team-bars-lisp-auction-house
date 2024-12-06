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
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';

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


      const handleSortByPrice = (order: 'asc' | 'desc') => {
        const sorted = [...items].sort((a, b) =>
          order === 'asc'
                ? a.iStartingPrice - b.iStartingPrice
                : b.iStartingPrice - a.iStartingPrice
            );
        setItems(sorted);
        setSortOrder(order);
    };

    const handleSortByStartDate = (order: 'asc' | 'desc') => {
        const sorted = [...items].sort((a, b) => {
            const dateA = new Date(a.iStartDate || '').getTime();
            const dateB = new Date(b.iStartDate || '').getTime();
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setItems(sorted);
        setStartDateSortOrder(startDateSortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleSortByEndDate = (order: 'asc' | 'desc') => {
        const sorted = [...items].sort((a, b) => {
            const dateA = new Date(a.iEndDate || '').getTime();
            const dateB = new Date(b.iEndDate || '').getTime();
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setItems(sorted);
        setEndDateSortOrder(endDateSortOrder === 'asc' ? 'desc' : 'asc');
    };

    const filterItems = (searchQuery: string): Item[] => {
        console.log("Items before filtering:", items);
      if (!searchQuery) return items;
        console.log("searchQuery",searchQuery)
      const query = searchQuery.toLowerCase().trim();
    
      // Price range regex: "10-20" or "10 to 20"
      const priceRangeRegex = /(\d+)[\s-]+to[\s-]+(\d+)/;
    
      // Start date regex: "start date YYYY-MM-DD" or "start date 1st November"
      const startDateRegex = /start date\s+(.+)/;
    
      // End date regex: "end date YYYY-MM-DD" or "end date 1st November"
      const endDateRegex = /end date\s+(.+)/;
    
      // Handle price range filtering
      const priceMatch = query.match(priceRangeRegex);
    
      if (priceMatch) {
        const minPrice = parseFloat(priceMatch[1]);
        const maxPrice = parseFloat(priceMatch[2]);
        console.log("Filtering by Price Range:", { minPrice, maxPrice });
      
        const filteredItems = items.filter((item) => {
          const price = parseFloat(item.iStartingPrice as unknown as string);
          console.log("Checking item price:", price, "Min:", minPrice, "Max:", maxPrice);
          return price >= minPrice && price <= maxPrice;
        });
      
        console.log("Filtered Items by Price:", filteredItems);
        return filteredItems;
      }
    
      // Handle start date filtering
      const startDateMatch = query.match(startDateRegex);
      console.log("startDateMatch",startDateMatch)
      if (startDateMatch) {
        const startDate = new Date(startDateMatch[1]).getTime();
    
        return items.filter((item) => {
          const itemStartDate = new Date(item.iStartDate || '').getTime();
          return itemStartDate >= startDate;
        });
      }
    
      // Fallback to text-based search (item name, description, or price)
      return items.filter(
        (item) =>
          item.iName.toLowerCase().includes(query) ||
          item.iDescription.toLowerCase().includes(query) ||
          item.iStartingPrice.toString().includes(query)
      );
    };

    return (
        <Container>
        {/* <div className="container mt-4"> */}
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
                    <Form.Control onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items using name,decription,price and price range (format e.g., 'price 10 to 20')"/>
                    </InputGroup>
                </Form>
            <div className="d-flex justify-content-center align-items-center gap-4 mb-4">
                <Dropdown>
                <Dropdown.Toggle variant="secondary">Sort Price</Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleSortByPrice('asc')}>Low to High</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortByPrice('desc')}>High to Low</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                <Dropdown.Toggle variant="secondary">Sort Start Date</Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleSortByStartDate('asc')}>Earliest to Latest</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortByStartDate('desc')}>Latest to Earliest</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                <Dropdown.Toggle variant="secondary">Sort End Date</Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleSortByEndDate('asc')}>Earliest to Latest</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortByEndDate('desc')}>Latest to Earliest</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </div>
            {/* </div> */}

            {/* Items Section */}
            <div className="mt-4">
                <h3>Sold Items in the last 24 hours</h3>
                <div className="row">
                {filterItems(search).length > 0 ? (
    filterItems(search).map((items, index) => (
      <div key={index} className="col-lg-3 col-md-6 col-sm-11 mb-4">
        <div
          onClick={() => viewItemDetails(items)}
          className="card h-100 border-0 shadow-sm rounded-3"
        >
          <div className="image-container">
            <img
              src={
                typeof items.iImage === 'string'
                  ? items.iImage
                  : URL.createObjectURL(items.iImage)
              }
              className="card-img-top"
              alt={items.iName}
              style={{
                height: '200px',
                objectFit: 'cover',
                borderTopLeftRadius: '0.75rem',
                borderTopRightRadius: '0.75rem',
              }}
            />
          </div>
          <div className="card-body text-center">
            <h5 className="card-title text-truncate">{items.iName}</h5>
            <p className="card-text text-muted small text-truncate">{items.iDescription}</p>
            <p>
              <strong>Price:</strong> ${items.iStartingPrice}
            </p>
            <p>
              <strong>Start Date:</strong> {items.iStartDate || 'N/A'}
            </p>
            <p>
              <strong>End Date:</strong> {items.iEndDate || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center">No items match your search</p>
  )}
</div>
</div>
    </Container>
  );
}
