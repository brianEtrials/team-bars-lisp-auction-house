import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import CloseAccount from './closeaccounts';
import Logout from './logout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Form, Modal, Row, InputGroup } from 'react-bootstrap';


interface Item {
  item_ID: number;
  iName: string;
  iDescription: string;
  iImage: string | File;
  iStartingPrice: number;
  iStartDate?: string;
  iEndDate?: string;
  iStatus?: string;
  duration?: number;
  iNumBids?: number;
}

export default function FetchItemsComponent() {
      // routing purpose
  const location = useLocation();
  const [items, setItems] = useState<Item[]>([]);
  const [sellerInfo, setSellerInfo] = useState({ id: 0, first_name: '', last_name: '', email: '' });  // State for seller information
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState({
    iName: '',
    iDescription: '',
    iImage: '',
    iStartingPrice: '',
    duration: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [redraw, forceRedraw] = useState(0);
  const usernamedata = location.state.username as string;
  const accountInfo = location.state;

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://dkgwfpcoeb.execute-api.us-east-1.amazonaws.com/itemreview/review',
        { params: { username: usernamedata }});
      const responseData = typeof response.data.body === 'string' ? JSON.parse(response.data.body) : response.data;
      console.log(responseData)
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



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };
  


  const addItem = async () => {
    const { iName, iDescription, iStartingPrice} = newItem;
    console.log("User name data ",usernamedata)
    if (!iName || !iDescription || !imageFile || !iStartingPrice) {
      alert('Please fill in all required fields: Item Name, Description, Image URL, and Starting Price.');
      return;
    }

    try {
//--------------------------------------------Add s3 image code here----------------------------------

const base64Image = await toBase64(imageFile);
      console.log("Base64 Image Data:", base64Image);

      // Call the Lambda function for image upload
      const lambdaResponse = await axios.post('https://7q6rjwey4m.execute-api.us-east-1.amazonaws.com/upload-image/upload-image',
        { base64Image },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // Parse the response body if it's still in string format
      const responseData = typeof lambdaResponse.data.body === 'string' 
      ? JSON.parse(lambdaResponse.data.body) 
      : lambdaResponse.data;

      console.log('Lambda response:', lambdaResponse); 

      // Extract image URL from Lambda response
      const iImage = responseData.imageUrl;
      if (!iImage) throw new Error("Image upload failed");

      // Add the item with image URL to the item data
        const itemData = { ...newItem, iImage, username: usernamedata };
      console.log("these are all items details",itemData)


//--------------------------------------------Add s3 image code here----------------------------------

      //Post item data to add-item endpoint
      await axios.post('https://rk6fe66yz1.execute-api.us-east-1.amazonaws.com/add-item', itemData, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Item added successfully!');
      setNewItem({ iName: '', iDescription: '', iImage: '', iStartingPrice: '', duration: ''});
      setImageFile(null);
      fetchItems();
    } catch (error: any) {
      console.error('Failed to add item:', error.response || error.message);
      alert('Failed to add item: ' + (error.response ? error.response.data.message : error.message));
    }
  };

//--------------------------------------------Add s3 image code here----------------------------------

// Utility function to convert image file to base64
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });


//--------------------------------------------Add s3 image code here----------------------------------


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

  const archiveItem = async (item_ID: number) => {
    fetchItems();

    try {
      await axios.post( 'https://d70j4jm6gc.execute-api.us-east-1.amazonaws.com/archiveItem/archiveItem', { item_ID }, {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      alert('Item archived successfully!');
      fetchItems();
    } catch (error: any) {
      console.error('Failed to archive item:', error.response || error.message);
      alert(
        'Failed to archive item: ' +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };


  const setPending = async (item_ID: number) => {
    try {
      await axios.post(
        'https://fd0l3xd4ql.execute-api.us-east-1.amazonaws.com/pending-item/pending-item',
        { item_ID },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('Item status changed to pending successfully!');
      fetchItems();
    } catch (error: any) {
      console.error('Failed to update item to pending:', error.response || error.message);
      alert('Failed to update item status to pending: ' + (error.response ? error.response.data.message : error.message));
    }
  };
  

  
  function EditForm({ item, onSave }: { item: Item | null; onSave: (updatedItem: Partial<Item>) => void }) {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const form = event.currentTarget;

      if (form.checkValidity() === false) {
        setValidated(true);
        return;
      }

      setValidated(true);

      const updatedItem: Partial<Item> = {
        iName: (form.elements.namedItem("iName") as HTMLInputElement).value,
        iDescription: (form.elements.namedItem("iDescription") as HTMLInputElement).value,
        iStartingPrice: parseFloat((form.elements.namedItem("iStartingPrice") as HTMLInputElement).value),
        duration: parseInt((form.elements.namedItem("duration") as HTMLInputElement).value, 10),
      };

      const imageInput = form.elements.namedItem("iImage") as HTMLInputElement;
      if (imageInput.files && imageInput.files.length > 0) { 
        updatedItem.iImage = imageInput.files[0]; 
      };

      onSave(updatedItem);
    };

    return (
      <Form noValidate validated={validated} onSubmit={handleSubmit} className="needs-validation">
        {/* Item Name */}
        <Form.Group as={Col} md="6" controlId="validationItemName">
          <Form.Label>Item Name (it has to be unique)</Form.Label>
          <Form.Control required type="text" name="iName" defaultValue={item?.iName} placeholder="Enter item name" />
          <Form.Control.Feedback>Good enough</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid" tooltip>
           Please provide an item name.
          </Form.Control.Feedback>
        </Form.Group>
  
        {/* Description */}
        <Form.Group as={Col} md="6" controlId="validationDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control required type="text" name="iDescription" defaultValue={item?.iDescription} placeholder="Enter item description" />
          <Form.Control.Feedback>Good enough.</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid" tooltip>
            Please provide an item description.
          </Form.Control.Feedback>
        </Form.Group>
  
        {/* Image Upload */}
        <Form.Group as={Col} md="6" controlId="validationImage">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" name="iImage" accept="image/*" />
          {item?.iImage && (
            <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
              Upload a new image to replace the old one, or leave this empty to keep the current image.
            </div>
          )}            
          <Form.Control.Feedback>Good enough.</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Please provide an item image.
          </Form.Control.Feedback>
        </Form.Group>
  
        {/* Starting Price */}
        <Form.Group as={Col} md="6" controlId="validationStartingPrice">
          <Form.Label>Starting Price</Form.Label>
          <Form.Control required type="number" name="iStartingPrice" defaultValue={item?.iStartingPrice} placeholder="Enter starting price" />
          <Form.Control.Feedback>Good enough</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid" tooltip>
            Please provide a starting price. (At least 1$)
          </Form.Control.Feedback>
        </Form.Group>
  
        {/* Duration */}
        <Form.Group as={Col} md="6" controlId="validationDuration">
          <Form.Label>Duration (in days)</Form.Label>
          <Form.Control type="number" name="duration" defaultValue={item?.duration} placeholder="Enter duration in days" />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Please provide a valid duration.
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit"> Save Changes</Button>
      </Form>
    );
  }
  
  

  function EditItemModal({ show, onHide, item, onSave, }: { show: boolean, onHide: () => void, item: Item | null, onSave: (updatedItem: Partial<Item>) => void; }) {
    return (
      <Modal
        show={show} onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Item
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditForm item={item} onSave={(updatedItem) => {
            onSave({ ...item, ...updatedItem});
            onHide();
          }}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Abort Mission</Button>
          {/*<Button variant="primary" onClick={editItem}>Save Changes</Button>*/}
        </Modal.Footer>
      </Modal>
    );
  }

  const editItem = (item: Item) => {
    setSelectedItem(item);
    seteditModal(true);

  }

  const [editModal, seteditModal] = React.useState(false);

  const handleSaveItem = async (updatedItem: Partial<Item>) => {
    if (!selectedItem) return;
    console.log('This is the item to be edited:', selectedItem);

    const { iImage } = selectedItem;
    console.log('This is the image of the item to be edited:', iImage);

    console

    try {
        let updatedItemData = { ...selectedItem, ...updatedItem };
    
        if (updatedItem.iImage instanceof File) {
            console.log('Handling image upload...');
    
            if (typeof iImage === 'string') {
                const urlObj = new URL(iImage);
                const imageKey = urlObj.pathname.substring(1);
    
                if (!imageKey) {
                    throw new Error('Invalid image URL: Could not extract image key.');
                }
    
                console.log('This is the image key:', imageKey);
                await axios.post(
                    'https://06nnzho0si.execute-api.us-east-1.amazonaws.com/delete-item-image/delete-uploaded-image',
                    { imageKey },
                    { headers: { 'Content-Type': 'application/json' } }
                );
    
                console.log('Previous image deleted successfully');
            }
    
            const base64Image = await toBase64(updatedItem.iImage);
            console.log('Base64 Image Data:', base64Image);
    
            const lambdaResponse = await axios.post(
                'https://7q6rjwey4m.execute-api.us-east-1.amazonaws.com/upload-image/upload-image',
                { base64Image },
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            const responseData = typeof lambdaResponse.data.body === 'string'
                ? JSON.parse(lambdaResponse.data.body)
                : lambdaResponse.data;
    
            console.log('Lambda response:', lambdaResponse);
    
            const editImageUrl = responseData.imageUrl;
            if (!editImageUrl) throw new Error('Image upload failed');
    
            // Update the image in the final payload
            updatedItemData = {
                ...updatedItemData,
                iImage: editImageUrl,
            };
        }
    
        console.log('Payload being sent:', updatedItemData);
    
        // Send the final payload to the backend
        await axios.post(
            'https://3vxhbc6r07.execute-api.us-east-1.amazonaws.com/eDit-iTem/eDit-iTem',
            updatedItemData,
            { headers: { 'Content-Type': 'application/json' } }
        );
    
        alert('Item updated successfully!');
        fetchItems();
    } catch (error: any) {
        console.error('Failed to update item:', error);
        alert('Failed to update item: ' + error.message);
    }  
  }


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
    else if (action === 'Unfreeze') {
      setPending(itemId);
    }
    else if(action === 'Fulfill'){
    
     }
     else if(action === 'Remove'){

    }
    else if(action === 'Archive'){
      archiveItem(itemId);
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
              <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2' }}></th>
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
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}><Button variant="outline-secondary" onClick={() => editItem(item)} disabled={item.iStatus === 'active' || item.iStatus === 'pending' || item.iStatus === 'frozen' || item.iStatus === 'archived' || item.iStatus === 'fulfilled' || item.iStatus === 'completed' }>Edit</Button> <EditItemModal show={editModal} onHide={() => seteditModal(false)} item={selectedItem} onSave={(updatedItem) => { handleSaveItem(updatedItem); seteditModal(false); }}/></td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.item_ID}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iName}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.iDescription}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}><img src={item.iImage instanceof File ? URL.createObjectURL(item.iImage) : item.iImage} alt={item.iName} width="100" /></td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>${item.iStartingPrice}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}> {item.iStatus !== 'inactive' ? item.iStartDate : ''} </td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}> {item.iStatus !== 'inactive' ? item.iEndDate : ''} </td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.iStatus}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.duration}</td>
                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                  <select value="Action" onChange={(e) => selected_action(item.item_ID, e.target.value)} style={{ padding: '5px', fontSize: '14px' }}>
                    <option value="Action" disabled>Action</option>
                    {/* <option value="Remove">Remove</option> */}
                    <option value="Publish" disabled={['active', 'completed', 'archived', 'pending', 'frozen', 'fulfilled'].includes(item.iStatus || '')}>Publish</option>
                    <option value="Unpublish" disabled={['inactive', 'completed', 'archived', 'failed', 'pending', 'frozen', 'fulfilled'].includes(item.iStatus || '')}>Unpublish</option>
                    <option value="Fulfill" disabled={item.iStatus !== 'completed'}>Fulfill</option>
                    <option value="Remove" disabled={item.iStatus === 'active' || item.iStatus === 'pending' || item.iStatus === 'frozen' || item.iStatus === 'archived'}>Remove</option>
                    <option value="Archive" disabled={item.iStatus === 'active' || item.iStatus === 'pending' || item.iStatus === 'frozen' || item.iStatus === 'completed' || item.iStatus === 'archived'}>Archive</option>
                    <option value="Unfreeze" disabled={item.iStatus !== 'frozen'}>Unfreeze</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center' }}>No items available for review.</p>
      )}
      <CloseAccount id={accountInfo.idaccounts}/>
      <Logout />
    </div>
  );
}