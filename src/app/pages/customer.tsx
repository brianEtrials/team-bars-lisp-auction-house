import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import logo from '../../../img/logo.png';

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
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const fetchItemData = async () => {
    try {
      const response = await axios.get(
        'https://qw583oxspk.execute-api.us-east-1.amazonaws.com/cutomer-view/customerView'
      );

      const responseData = typeof response.data.body === 'string'
        ? JSON.parse(response.data.body)
        : response.data;

      if (responseData?.itemdata?.items) {
        setItems(responseData.itemdata.items);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
    }
  };

  const signpage = () => {
    navigate('/accounts');
  };

  const itemdetail = (selecteditems: Item) => {
    navigate('/ItemDetail', { state: { ...selecteditems } });
  };

  useEffect(() => {
    fetchItemData();
  }, []);

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
  };

  const handleSortByEndDate = (order: 'asc' | 'desc') => {
    const sorted = [...items].sort((a, b) => {
      const dateA = new Date(a.iEndDate || '').getTime();
      const dateB = new Date(b.iEndDate || '').getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setItems(sorted);
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
      <img
        src={logo.src}
        width="70px"
        height="70px"
        className="position-absolute top-2 start-20"
        alt="Button image"
      />
      <Button className="rounded-pill position-absolute top-2 end-20" onClick={signpage}>
        Sign in
      </Button>
      <br />
      <br />
      <Form>
      <InputGroup className="my-3">
        <Form.Control
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items using name,decription,price and price range (format e.g., 'price 10 to 20')"
        />
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

      <h2>Items</h2>
      <div className="row">
  {filterItems(search).length > 0 ? (
    filterItems(search).map((items, index) => (
      <div key={index} className="col-lg-3 col-md-6 col-sm-11 mb-4">
        <div
          onClick={() => itemdetail(items)}
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

    </Container>
  );
}


//--------------------------------------------good code------------------------------------
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from "react-router-dom";
// import Container from "react-bootstrap/Container";
// import Form from "react-bootstrap/Form";
// import InputGroup from "react-bootstrap/InputGroup";
// import Button from "react-bootstrap/Button";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";
// import logo from '../../../img/logo.png';

// interface Item {
//   item_ID: number;
//   iName: string;
//   iDescription: string;
//   iImage: string | File;
//   iStartingPrice: number;
//   iStartDate?: string;
//   iEndDate?: string;
// }

// export default function CustomerPage() {
//   const [items, setItems] = useState<Item[]>([]);
//   const [search, setSearch] = useState('');
//   const [sortCriteria, setSortCriteria] = useState<string>('Sort by'); // Track current sorting criteria
//   const navigate = useNavigate();

//   const fetchItemData = async () => {
//     try {
//       const response = await axios.get(
//         'https://qw583oxspk.execute-api.us-east-1.amazonaws.com/cutomer-view/customerView'
//       );
//       const responseData = typeof response.data.body === 'string'
//         ? JSON.parse(response.data.body)
//         : response.data;

//       if (responseData && responseData.itemdata && Array.isArray(responseData.itemdata.items)) {
//         setItems(responseData.itemdata.items);
//       } else {
//         setItems([]);
//       }
//     } catch (error) {
//       console.error('Failed to fetch items:', error);
//       setItems([]);
//     }
//   };

//   useEffect(() => {
//     fetchItemData();
//   }, []);

//   const sortItems = (criteria: string) => {
//     let sorted = [...items];
//     switch (criteria) {
//       case 'Price: Low to High':
//         sorted.sort((a, b) => a.iStartingPrice - b.iStartingPrice);
//         break;
//       case 'Price: High to Low':
//         sorted.sort((a, b) => b.iStartingPrice - a.iStartingPrice);
//         break;
//       case 'Start Date: Earliest First':
//         sorted.sort((a, b) => new Date(a.iStartDate || '').getTime() - new Date(b.iStartDate || '').getTime());
//         break;
//       case 'Start Date: Latest First':
//         sorted.sort((a, b) => new Date(b.iStartDate || '').getTime() - new Date(a.iStartDate || '').getTime());
//         break;
//       case 'End Date: Earliest First':
//         sorted.sort((a, b) => new Date(a.iEndDate || '').getTime() - new Date(b.iEndDate || '').getTime());
//         break;
//       case 'End Date: Latest First':
//         sorted.sort((a, b) => new Date(b.iEndDate || '').getTime() - new Date(a.iEndDate || '').getTime());
//         break;
//       default:
//         return; // No sorting
//     }
//     setItems(sorted);
//     setSortCriteria(criteria);
//   };

//   return (
//     <Container>
//       {/* Header Section */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <img src={logo.src} width="70px" height="70px" alt="Logo" />
//         <Button className="rounded-pill" onClick={() => navigate("/accounts")}>Sign in</Button>
//       </div>

//       {/* Search and Sort Section */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         {/* Search Bar */}
//         <InputGroup className="w-50">
//           <Form.Control
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search items"
//           />
//         </InputGroup>

//         {/* Sorting Dropdown */}
//         <DropdownButton
//           title={sortCriteria}
//           className="btn-secondary"
//           onSelect={(e) => sortItems(e || 'Sort by')}
//         >
//           <Dropdown.Item eventKey="Price: Low to High">Price: Low to High</Dropdown.Item>
//           <Dropdown.Item eventKey="Price: High to Low">Price: High to Low</Dropdown.Item>
//           <Dropdown.Item eventKey="Start Date: Earliest First">Start Date: Earliest First</Dropdown.Item>
//           <Dropdown.Item eventKey="Start Date: Latest First">Start Date: Latest First</Dropdown.Item>
//           <Dropdown.Item eventKey="End Date: Earliest First">End Date: Earliest First</Dropdown.Item>
//           <Dropdown.Item eventKey="End Date: Latest First">End Date: Latest First</Dropdown.Item>
//         </DropdownButton>
//       </div>

//       {/* Items Section */}
//       <h2>Items</h2>
//       <div className="row">
//         {items.length > 0 ? (
//           items.filter((item) => {
//             return search.toLowerCase() === ''
//               ? item
//               : item.iName.toLowerCase().includes(search) ||
//                 item.iDescription.toLowerCase().includes(search) ||
//                 item.iStartingPrice.toString().includes(search);
//           }).map((item, index) => (
//             <div key={index} className="col-lg-3 col-md-6 col-sm-11 mb-4">
//               <div
//                 onClick={() => navigate("/ItemDetail", { state: { ...item } })}
//                 className="card h-100 border-0 shadow-sm rounded-3"
//               >
//                 <img
//                   src={typeof item.iImage === 'string' ? item.iImage : URL.createObjectURL(item.iImage)}
//                   className="card-img-top"
//                   alt={item.iName}
//                   style={{
//                     height: '200px',
//                     objectFit: 'cover',
//                     borderTopLeftRadius: '0.75rem',
//                     borderTopRightRadius: '0.75rem',
//                   }}
//                 />
//                 <div className="card-body text-center">
//                   <h5 className="card-title text-truncate">{item.iName}</h5>
//                   <p className="card-text text-muted small text-truncate">{item.iDescription}</p>
//                   <p><strong>Price:</strong> ${item.iStartingPrice}</p>
//                   <p><strong>Start Date:</strong> {item.iStartDate || 'N/A'}</p>
//                   <p><strong>End Date:</strong> {item.iEndDate || 'N/A'}</p>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center">No items available</p>
//         )}
//       </div>
//     </Container>
//   );
// }
//--------------------------------------------good code------------------------------------
