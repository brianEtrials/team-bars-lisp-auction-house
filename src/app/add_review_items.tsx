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
  const [redraw, forceRedraw] = useState(0);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://6fcuh9wqla.execute-api.us-east-1.amazonaws.com/review-items');
      const responseData = typeof response.data.body === 'string' ? JSON.parse(response.data.body) : response.data;
      setItems(responseData.items || []);
      forceRedraw(redraw + 1);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
    }
  };

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

  const deleteitem = async (item_ID) => {
    try {
      await axios.post('https://ol1cazlhx6.execute-api.us-east-1.amazonaws.com/remove-item', { item_ID }, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Item deleted successfully!');
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error.response || error.message);
      alert('Failed to delete item: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const selected_action = (itemId, action) => {
    console.log(`Item ID: ${itemId}, Selected Action: ${action}`);
    if (action === 'Remove') {
      deleteitem(itemId);
    } 
    else if (action == 'Publish'){

    }
    else if (action == 'Unpublish'){

    }
    else if(action == 'Fulfill'){
    
     }
     else if(action == 'Remove'){

    }
    else if(action == 'Remove'){

    }
    else{
      alert("Select to proceed")
     } 
    }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>ADD A NEW ITEM</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px', margin: '0 auto', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ width: '150px', fontWeight: 'bold' }}>Item Name *</label>
          <input name="iName" value={newItem.iName} onChange={handleInputChange} placeholder="Item Name" style={{ flex: 1, padding: '8px', fontSize: '16px' }} required />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ width: '150px', fontWeight: 'bold' }}>Description *</label>
          <input name="iDescription" value={newItem.iDescription} onChange={handleInputChange} placeholder="Description" style={{ flex: 1, padding: '8px', fontSize: '16px' }} required />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ width: '150px', fontWeight: 'bold' }}>Image URL *</label>
          <input name="iImage" value={newItem.iImage} onChange={handleInputChange} placeholder="Image URL" style={{ flex: 1, padding: '8px', fontSize: '16px' }} required />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ width: '150px', fontWeight: 'bold' }}>Starting Price *</label>
          <input name="iStartingPrice" type="number" value={newItem.iStartingPrice} onChange={handleInputChange} placeholder="Starting Price" style={{ flex: 1, padding: '8px', fontSize: '16px' }} required />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ width: '150px', fontWeight: 'bold' }}>Duration (days)</label>
          <input name="iDuration" type="number" value={newItem.iDuration} onChange={handleInputChange} placeholder="Duration (days)" style={{ flex: 1, padding: '8px', fontSize: '16px' }} />
        </div>
        <button onClick={addItem} style={{ padding: '10px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', marginTop: '10px' }}>
          Add Item
        </button>
      </div>

      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>REVIEW ITEMS</h2>
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
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}><img src={item.iImage} alt={item.iName} width="100" /></td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>${item.iStartingPrice}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iStartDate}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iEndDate}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iStatus}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iDuration}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  <select value="Action" onChange={(e) => selected_action(item.item_ID, e.target.value)} style={{ padding: '5px', fontSize: '14px' }}>
                    <option value="Action" disabled>Action</option>
                    {/* <option value="Remove">Remove</option> */}
                    <option value="Publish">Publish</option>
                    <option value="Unpublish">Unpublish</option>
                    <option value="Fulfill">Fulfill</option>
                    <option value="Remove" disabled={item.iStatus === 'publish'}>Remove</option>
                    <option value="Archive">Archive</option>
                    <option value="Unfreeze">Unfreeze</option>
                    {/* Add more options if needed */}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center' }}>No items available for review.</p>
      )}
    </div>
  );
}
