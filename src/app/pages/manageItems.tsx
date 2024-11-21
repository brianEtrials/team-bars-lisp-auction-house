'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Item {
  item_ID: number;
  iName: string;
  seller_id: number;
  iStatus: string;
}

export default function ManageItems() {
  const [items, setItems] = useState<Item[]>([]);

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch items function
  const fetchItems = async () => {
    try {
      const response = await axios.get(
        'https://y1clx3ndke.execute-api.us-east-1.amazonaws.com/manage-items-admin/manage-items-admin',
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = typeof response.data.body === 'string'
        ? JSON.parse(response.data.body)
        : response.data.body;

      console.log('Fetched Items:', data);
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  // Handle action (freeze/unfreeze)
  const handleAction = async (item_ID: number, action: string) => {
    console.log(`Action triggered: ${action}, Item ID: ${item_ID}`);
    const apiUrl =
      action === 'Freeze'
        ? 'https://0uap0gdlld.execute-api.us-east-1.amazonaws.com/freeze-item/freeze-item'
        : 'https://goigqdsm1h.execute-api.us-east-1.amazonaws.com/unfreeze-item/unfreeze-item';

    try {
      console.log('Payload being sent:', { item_ID });
      const response = await axios.post(
        apiUrl,
        { item_ID },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log(`API Response for ${action}:`, response.data);
      alert(`Item ${action}d successfully!`);

      // Refresh the items list after the action
      fetchItems();
    } catch (error) {
      console.error(`Failed to ${action} item:`, error);
      alert(`Failed to ${action} item.`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Manage Items</h1>
      {items.length > 0 ? (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1em',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Seller</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.item_ID}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iName}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.seller_id}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iStatus}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  <button
                    className="action-button"
                    style={{
                      margin: '0 5px',
                      padding: '5px 10px',
                      backgroundColor: ['frozen', 'pending', 'active'].includes(item.iStatus) ? '#333' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: ['active', 'frozen', 'pending'].includes(item.iStatus) ? 'pointer' : 'not-allowed',
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.iStatus === 'active') handleAction(item.item_ID, 'Freeze');
                      else if (['frozen', 'pending'].includes(item.iStatus)) handleAction(item.item_ID, 'Unfreeze');
                    }}
                    disabled={!['active', 'frozen', 'pending'].includes(item.iStatus)}
                  >
                    {item.iStatus === 'frozen' || item.iStatus === 'pending' ? 'Unfreeze' : 'Freeze'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center' }}>No items available for management.</p>
      )}
    </div>
  );
}
