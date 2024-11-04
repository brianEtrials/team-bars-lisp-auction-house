'use client'
import React, { useState } from 'react';
import axios from 'axios'; // HTTP requests

export default function AddItem() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    iName: '',
    iDescription: '',
    iImage: '',
    iStartingPrice: '',
    iStartDate: '',
    iDuration: ''
  });

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const addItem = async () => {
    try {
      const response = await axios.post('https://ulxzavbwoi.execute-api.us-east-1.amazonaws.com/add-item/add-item', newItem, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setItems([...items, newItem]);
      setNewItem({ iName: '', iDescription: '', iImage: '', iStartingPrice: '', iStartDate: '', iDuration: ''});
      alert('Item added successfully!');
    } catch (error) {
      console.error('Failed to add item:', error.response || error.message);
      alert('Failed to add item: ' + (error.response ? error.response.data.message : error.message));
    }
  };  

  return (
    <div>
      <h1>Add Item</h1>
      <input name="iName" value={newItem.iName} onChange={handleInputChange} placeholder="Item Name" />
      <input name="iDescription" value={newItem.iDescription} onChange={handleInputChange} placeholder="Description" />
      <input name="iImage" value={newItem.iImage} onChange={handleInputChange} placeholder="Image URL" />
      <input name="iStartingPrice" type="number" value={newItem.iStartingPrice} onChange={handleInputChange} placeholder="Starting Price" />
      <input name="iStartDate" type="date" value={newItem.iStartDate} onChange={handleInputChange} />
      <input name="iDuration" type="number" value={newItem.iDuration} onChange={handleInputChange} placeholder="Duration (days)" />
      <button onClick={addItem}>Add Item</button>

      <h2>Items List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Starting Price</th>
            <th>Start Date</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.iName}</td>
              <td>{item.iDescription}</td>
              <td><img src={item.iImage} alt="Item" style={{ width: '50px' }}/></td>
              <td>{item.iStartingPrice}</td>
              <td>{item.iStartDate}</td>
              <td>{item.iDuration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
