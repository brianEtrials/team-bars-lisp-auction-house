import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function FetchItemsComponent() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    iName: '',
    iDescription: '',
    iImage: '',
    iStartingPrice: '',
    iDuration: ''
  });

  // Function to fetch items from the API
  const fetchItems = async () => {
    try {
      const response = await axios.get('https://6fcuh9wqla.execute-api.us-east-1.amazonaws.com/review-items');
      console.log("API Response:", response);
  
      const responseData = typeof response.data.body === 'string' ? JSON.parse(response.data.body) : response.data;
  
      setItems(responseData.items || []);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
    }
  };  

  // Fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const addItem = async () => {
    const { iName, iDescription, iImage, iStartingPrice } = newItem;
    if (!iName || !iDescription || !iImage || !iStartingPrice) {
      alert('Please fill in all required fields: Item Name, Description, Image URL, and Starting Price.');
      return;
    }

    try {
      await axios.post('https://ulxzavbwoi.execute-api.us-east-1.amazonaws.com/add-item/add-item', newItem, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Item added successfully!');
      
      setNewItem({ iName: '', iDescription: '', iImage: '', iStartingPrice: '', iDuration: '' });
      
      fetchItems();
    } catch (error) {
      console.error('Failed to add item:', error.response || error.message);
      alert('Failed to add item: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Item</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px', margin: '0 auto', paddingBottom: '20px' }}>
        <input name="iName" value={newItem.iName} onChange={handleInputChange} placeholder="Item Name" style={{ padding: '8px', fontSize: '16px' }} required />
        <input name="iDescription" value={newItem.iDescription} onChange={handleInputChange} placeholder="Description" style={{ padding: '8px', fontSize: '16px' }} required />
        <input name="iImage" value={newItem.iImage} onChange={handleInputChange} placeholder="Image URL" style={{ padding: '8px', fontSize: '16px' }} required />
        <input name="iStartingPrice" type="number" value={newItem.iStartingPrice} onChange={handleInputChange} placeholder="Starting Price" style={{ padding: '8px', fontSize: '16px' }} required />
        <input name="iDuration" type="number" value={newItem.iDuration} onChange={handleInputChange} placeholder="Duration (days)" style={{ padding: '8px', fontSize: '16px' }} />
        <button onClick={addItem} style={{ padding: '10px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
          Add Item
        </button>
      </div>

      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Items List</h2>
      {items.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1em', fontFamily: 'Arial, sans-serif' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Item ID</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Item Name</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Description</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Image</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Item Price</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Start Date</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>End Date</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Duration</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.item_ID}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iName}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.iDescription}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  <img src={item.iImage} alt="Item" style={{ width: '50px', height: 'auto' }} />
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iStartingPrice}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iStartDate}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iEndDate}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iStatus}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.duration}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  <select style={{ color: '#aaa' }}>
                    <option disabled>Publish</option>
                    <option disabled>Unpublish</option>
                    <option disabled>Fulfil</option>
                    <option disabled>Remove</option>
                    <option disabled>Archive</option>
                    <option disabled>Unfreeze</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No items found</p>
      )}
    </div>
  );
}
