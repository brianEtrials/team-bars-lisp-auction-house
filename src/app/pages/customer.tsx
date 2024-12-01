import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"; 
import Button from "react-bootstrap/Button"
import logo from  '../../../img/logo.png'


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
  const [search,setSearch] = useState('')
  console.log("search bar ",search)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Track sort order
  const [startDateSortOrder, setStartDateSortOrder] = useState<'asc' | 'desc'>('asc');
  const [endDateSortOrder, setEndDateSortOrder] = useState<'asc' | 'desc'>('asc');
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

  const itemdetail =(selecteditems:Item)=>{
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

  const handleSortByPrice = () => {
    const sorted = [...items].sort((a, b) => {
      return sortOrder === 'asc'
        ? a.iStartingPrice - b.iStartingPrice
        : b.iStartingPrice - a.iStartingPrice;
    });
    setItems(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
  };

  const handleSortByStartDate = () => {
    const sorted = [...items].sort((a, b) => {
      const dateA = new Date(a.iStartDate || '').getTime();
      const dateB = new Date(b.iStartDate || '').getTime();
      return startDateSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setItems(sorted);
    setStartDateSortOrder(startDateSortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
  };

  const handleSortByEndDate = () => {
    const sorted = [...items].sort((a, b) => {
      const dateA = new Date(a.iEndDate || '').getTime();
      const dateB = new Date(b.iEndDate || '').getTime();
      return endDateSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setItems(sorted);
    setEndDateSortOrder(endDateSortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
  };

  return (  
    // <div className="container mt-4">
    //   <button id ="signin" onClick={signpage}>Sign in</button>
    <Container>
    {/* <div className="p-3 border border-dark d-flex gap-2 align-items-center"> */}
    <img src={logo.src} width="70px" height="70px" className="position-absolute top-2 start-20" alt="Button image"/>
    <Button className="rounded-pill position-absolute top-2 end-20" onClick={signpage}>Sign in</Button>
    <br/><br/>
    <Form>
      <InputGroup className='my-3'>
      <Form.Control onChange={(e)=> setSearch(e.target.value)} placeholder='Search items'/>
      </InputGroup>
    </Form>
    {/* </div> */}
    <div className="d-flex justify-content-center gap-3">
      <Button className="btn btn-secondary" variant="primary" onClick={handleSortByPrice}>
        Sort by Price ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
      </Button>
    <br/>
    <Button className="btn btn-secondary" variant="primary" onClick={handleSortByStartDate}>
        Sort by Start Date ({startDateSortOrder === 'asc' ? 'Low to High' : 'High to Low'})
      </Button>
    <br/>
    <Button className="btn btn-secondary" variant="primary" onClick={handleSortByEndDate}>
        Sort by End Date ({endDateSortOrder === 'asc' ? 'Low to High' : 'High to Low'})
      </Button>
      </div>
      <h2>Items</h2>                                              
      <div className="row">
        {items.length > 0 ? (
           items.filter((item)=>{
            return search.toLowerCase() ==='' 
            ? item 
            : item.iName.toLowerCase().includes(search) ||
              item.iDescription.toLowerCase().includes(search) ||
              item.iStartingPrice.toString().includes(search)
          }).map((items, index) => (
            <div key={index} className="col-lg-3  col-md-6 col-sm-11 mb-4">
              <div onClick={() => itemdetail(items)} className="card h-100 border-secondary rounded-0 p-3">
                <img
                  src={
                    typeof items.iImage === 'string'
                      ? items.iImage
                      : URL.createObjectURL(items.iImage)
                  }
                  className="card-img-top border-0 rounded-0"
                  alt={items.iName}
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title" >{items.iName}</h5>
                  <p className="card-text">{items.iDescription}</p>
                  <p><strong>Price:</strong> ${items.iStartingPrice}</p>
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
    {/* </div> */}
    </Container>
  );
}
