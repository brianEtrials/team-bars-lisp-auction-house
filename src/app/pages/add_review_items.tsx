import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';

// Add your AWS S3 configuration security key
AWS.config.update({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-east-1'
});
const s3 = new AWS.S3();
interface Item {
  item_ID: number;
  iName: string;
  iDescription: string;
  iImage: File;
  iStartingPrice: number;
  iStartDate?: string;
  iEndDate?: string;
  iStatus?: string;
  duration?: number;
  iNumBids?: number;
}

export default function FetchItemsComponent() {
  const [items, setItems] = useState<Item[]>([]);
  const [sellerInfo, setSellerInfo] = useState({ first_name: '', last_name: '', email: '' });  // State for seller information
  const [newItem, setNewItem] = useState({
    iName: '',
    iDescription: '',
    iImage: '',
    iStartingPrice: '',
    duration: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURLs, setImageURLs] = useState<{ [key: number]: string }>({}); // State for storing object URLs
  const [redraw, forceRedraw] = useState(0);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://6fcuh9wqla.execute-api.us-east-1.amazonaws.com/review-items');
      const responseData = typeof response.data.body === 'string' ? JSON.parse(response.data.body) : response.data;
      setItems(responseData.items || []);
      setSellerInfo(responseData.sellerInfo || {});  // Set seller information
      forceRedraw(redraw + 1);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    // Create object URLs for items with File type images
    const newImageURLs: { [key: number]: string } = {};

    items.forEach(item => {
      if (item.iImage instanceof File) {
        newImageURLs[item.item_ID] = URL.createObjectURL(item.iImage);
      }
    });
    setImageURLs(newImageURLs); // Update state with new URLs

    // Cleanup: Revoke object URLs when items change or component unmounts
    return () => {
      Object.values(newImageURLs).forEach(url => URL.revokeObjectURL(url));
    };
  }, [items]);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };
  

  const uploadImageToS3 = async (file: File) => {
    const params = {
      Bucket: 'uploadimage24',
      Key: `uploads/${Date.now()}_${file.name}`,
      Body: file,
      ACL: 'public-read'
    };

    const { Location } = await s3.upload(params).promise();
    return Location;
  };

  const addItem = async () => {
    const { iName, iDescription, iStartingPrice } = newItem;
    if (!iName || !iDescription || !imageFile || !iStartingPrice) {
      alert('Please fill in all required fields: Item Name, Description, Image URL, and Starting Price.');
      return;
    }

    try {

      const iImage = await uploadImageToS3(imageFile); // Upload image to S3 and get URL
      const itemData = { ...newItem, iImage }; // Add image URL to item data

      await axios.post('https://ulxzavbwoi.execute-api.us-east-1.amazonaws.com/add-item/add-item', itemData, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Item added successfully!');
      setNewItem({ iName: '', iDescription: '', iImage: '', iStartingPrice: '', duration: '' });
      setImageFile(null);
      fetchItems();
    } catch (error: any) {
      console.error('Failed to add item:', error.response || error.message);
      alert('Failed to add item: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const deleteitem = async (item_ID: number) => {
    try {
      await axios.post('https://ol1cazlhx6.execute-api.us-east-1.amazonaws.com/remove-item', { item_ID }, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Item deleted successfully!');
      fetchItems();
    } catch (error: any) {
      console.error('Failed to delete item:', error.response || error.message);
      alert('Failed to delete item: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const publishItem = async (item_ID: number) => {

    const itemToPublish = items.find((item) => item.item_ID === item_ID)as Item | undefined;

    if (!itemToPublish) {
      alert('Item not found');
      return;
    }

    const { duration, iStartingPrice } = itemToPublish;
    const durationValue = Number(duration);
    const startingPriceValue = Number(iStartingPrice);
  
    if (isNaN(durationValue) || durationValue < 1) {
      alert('Duration must be a number equal to or greater than 1.');
      return;
    }
  
    if (isNaN(startingPriceValue) || startingPriceValue <= 0 || !Number.isInteger(startingPriceValue)) {
      alert('Starting price must be a positive integer greater than 0.');
      return;
    }
  
    try {
      await axios.post('https://k5scly63ii.execute-api.us-east-1.amazonaws.com/publish-item/publishItem', { item_ID, durationValue }, {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      alert('Item published successfully!');
      fetchItems();
    } catch (error: any) {
      console.error('Failed to publish item:', error.response || error.message);
      alert(
        'Failed to publish item: ' +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };
  
  const unpublishItem = async (item_ID: number) => {
    fetchItems();
    const itemToUnpublish = items.find((item) => item.item_ID === item_ID) as Item | undefined;

    if (!itemToUnpublish) {
      alert('Item not found');
      return;
    }

    if (itemToUnpublish.iStatus !== 'active') {
      alert('Item is not active and cannot be unpublished.');
      return;
    }
    
    const numBids = Number(itemToUnpublish.iNumBids);
    if (numBids > 0) {
      alert('Item has bids and cannot be unpublished.');
      return;
    }
    
    try {
      await axios.post( 'https://975qwer2kh.execute-api.us-east-1.amazonaws.com/unpublish-item/unpublish-item', { item_ID }, {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      alert('Item unpublished successfully!');
      fetchItems();
    } catch (error: any) {
      console.error('Failed to unpublish item:', error.response || error.message);
      alert(
        'Failed to unpublish item: ' +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  const selected_action = (itemId: number, action: string) => {
    console.log(`Item ID: ${itemId}, Selected Action: ${action}`);
    if (action === 'Remove') {
      deleteitem(itemId);
    } 
    else if (action === 'Publish'){
      publishItem(itemId);
    }
    else if (action === 'Unpublish'){
      unpublishItem(itemId);
    }
    else if(action === 'Fulfill'){
    
     }
     else if(action === 'Remove'){

    }
    else if(action === 'Archive'){

    }
    else if(action === 'Unfreeze'){

    }
    else{
      alert("Select to proceed")
     } 
    }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Display seller information */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2>Seller Information</h2>
        <p>Name: {sellerInfo.first_name} {sellerInfo.last_name}</p>
        <p>Email: {sellerInfo.email}</p>
      </div>
      {/* Add item form and items table */}
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
          <label style={{ width: '150px', fontWeight: 'bold' }}>Image *</label>
          <input name="iImage" type="file" onChange={handleFileChange} accept="image/*" style={{ flex: 1, padding: '8px', fontSize: '16px' }} required />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ width: '150px', fontWeight: 'bold' }}>Starting Price *</label>
          <input name="iStartingPrice" type="number" value={newItem.iStartingPrice} onChange={handleInputChange} placeholder="Starting Price" style={{ flex: 1, padding: '8px', fontSize: '16px' }} required />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ width: '150px', fontWeight: 'bold' }}>Duration (days)</label>
          <input name="duration" type="number" value={newItem.duration} onChange={handleInputChange} placeholder="Duration (days)" style={{ flex: 1, padding: '8px', fontSize: '16px' }} />
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
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}><img src={item.iImage instanceof File ? URL.createObjectURL(item.iImage) : item.iImage} alt={item.iName} width="100" /></td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>${item.iStartingPrice}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}> {item.iStartDate || ''} </td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}> {item.iEndDate || ''} </td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iStatus}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.duration}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  <select value="Action" onChange={(e) => selected_action(item.item_ID, e.target.value)} style={{ padding: '5px', fontSize: '14px' }}>
                    <option value="Action" disabled>Action</option>
                    {/* <option value="Remove">Remove</option> */}
                    <option value="Publish" disabled={['active', 'completed', 'archived'].includes(item.iStatus || '')}>Publish</option>
                    <option value="Unpublish" disabled={['inactive', 'completed', 'archived', 'failed'].includes(item.iStatus || '')}>Unpublish</option>
                    <option disabled value="Fulfill">Fulfill</option>
                    <option value="Remove" disabled={item.iStatus === 'active'}>Remove</option>
                    <option value="Archive">Archive</option>
                    <option disabled value="Unfreeze">Unfreeze</option>
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