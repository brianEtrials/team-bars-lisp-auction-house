import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const calculateStars = (totalBids: number, maxBids: number): string => {
  const stars = Math.round((totalBids / maxBids) * 5); // Scale to 5 stars
  return '⭐'.repeat(stars) || 'No Stars'; // Fallback if no bids
};

export default function ForensicsReport() {
  const [forensicsReport, setForensicsReport] = useState([]);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchForensicsReport = async () => {
      try {
        const response = await axios.post(
          'https://9r1wd8xsk8.execute-api.us-east-1.amazonaws.com/forensics-report/forensics-report',
          {}, // Send an empty object since the backend doesn't require any payload
          { headers: { 'Content-Type': 'application/json' } }
        );

        const responseBody = JSON.parse(response.data.body);
        const data = Array.isArray(responseBody.forensicsReport) ? responseBody.forensicsReport : [];
        setForensicsReport(data);
      } catch (error) {
        console.error('Failed to fetch auction report:', error);
      }
    };

    fetchForensicsReport();
  }, []); // Empty dependency array to run only once when the component mounts

  const calculateCountdown = (endDate: number): string => {
    const now = new Date();
    const end = new Date(endDate * 1000); // Convert timestamp to milliseconds
    const diff = end.getTime() - now.getTime();
  
    if (diff <= 0) return 'Ended'; // Auction already ended
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
  
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const [bidsSortOrder, setBidsSortOrder] = useState('asc');
  const [priceSortOrder, setPriceSortOrder] = useState('asc');
  const [dateSortOrder, setDateSortOrder] = useState('asc');
  const [popularitySortOrder, setPopularitySortOrder] = useState('asc');

  useEffect(() => {
    // Update the countdown every second
    const interval = setInterval(() => {
      setForensicsReport((prevReport) => [...prevReport]);
    }, 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const downloadCSV = () => {
    const headers = ["Item ID", "Item Name", "Total Bids", "Status", "Current/Final Price", "Auction End Date"];
    const rows = forensicsReport.map(item => [
      item['Item ID'],
      item['Item Name'],
      item['Item Description'],
      item['Total Bids'],
      item['Status'],
      `${item['Current/Final Price']} USD`,
      new Date(item['Auction End Date'] * 1000).toLocaleDateString()
    ]);

    const csvContent = [
      headers,
      ...rows
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "forensics_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const maxBids = Math.max(...forensicsReport.map(item => item['Total Bids']), 0);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/adminDashboard">
          <button className="btn btn-primary">← Back to Dashboard</button>
        </Link>
      </div>

      <h1>Forensics Report</h1>

      {forensicsReport.length > 0 ? (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1em', fontFamily: 'Arial, sans-serif' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2', textAlign: 'center', width: '10%' }}>Item ID</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2', textAlign: 'center', width: '20%' }}>Item Name</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2', textAlign: 'center', width: '10%' }}>Item Image</th>
                <th
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    backgroundColor: '#f2f2f2',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative', 
                    width: '10%',
                  }}
                  onClick={() => {
                    setBidsSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                    setPriceSortOrder('none');
                    setDateSortOrder('none');
                    setPopularitySortOrder('none'); // Reset Popularity sort
                  }}                  
                >
                  Total Bids
                  <span style={{ marginLeft: '5px' }}>
                    {bidsSortOrder === 'asc' ? '⬆️' : '⬇️'}
                  </span>
                </th>

                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2', textAlign: 'center', position: 'relative'}}>
                  Status
                  <span
                    onClick={() => setStatusDropdownVisible((prev) => !prev)}
                    style={{ cursor: 'pointer', marginLeft: '5px' }}
                  >
                    ⏳
                  </span>
                  {statusDropdownVisible && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: 10,
                      }}
                    >
                      <ul
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        {['All', 'active', 'completed', 'fulfilled'].map((status) => (
                          <li
                            key={status}
                            onClick={() => {
                              setSelectedStatus(status);
                              setStatusDropdownVisible(false);
                            }}
                            style={{
                              padding: '5px 10px',
                              cursor: 'pointer',
                              background: selectedStatus === status ? '#f0f0f0' : 'white',
                              borderBottom: '1px solid #ddd',
                            }}
                          >
                            {status}
                          </li>
                        ))}
                      </ul>

                    </div>
                  )}
                </th>
                <th
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    backgroundColor: '#f2f2f2',
                    textAlign: 'center',
                    cursor: 'pointer',
                    width: '10%',
                  }}
                  onClick={() => {
                    setPriceSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                    setBidsSortOrder('none');
                    setDateSortOrder('none');
                    setPopularitySortOrder('none');
                  }}
                >
                  Current/Final Price (USD)
                  <span style={{ marginLeft: '5px' }}>
                    {priceSortOrder === 'asc' ? '⬆️' : '⬇️'}
                  </span>
                </th>
                <th
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    backgroundColor: '#f2f2f2',
                    textAlign: 'center',
                    cursor: 'pointer',
                    width: '10%',
                  }}
                  onClick={() => {
                    setPopularitySortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                    setBidsSortOrder('none');
                    setPriceSortOrder('none');
                    setDateSortOrder('none');
                  }}
                >
                  Popularity
                  <span style={{ marginLeft: '5px' }}>
                    {popularitySortOrder === 'asc' ? '⬆️' : '⬇️'}
                  </span>
                </th>
                <th
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    backgroundColor: '#f2f2f2',
                    textAlign: 'center',
                    cursor: 'pointer',
                    width: '15%',
                    fontWeight: 'bold',
                    color: '#007bff',
                  }}
                  onClick={() => {
                    setDateSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                    setBidsSortOrder('none');
                    setPriceSortOrder('none');
                    setPopularitySortOrder('none');
                  }}
                >
                  Auction End Date
                  <span style={{ marginLeft: '5px' }}>
                    {dateSortOrder === 'asc' ? '⬆️' : '⬇️'}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
            {forensicsReport
              .filter((item) => selectedStatus === 'All' || item['Status'] === selectedStatus)
              .sort((a, b) => {
                if (popularitySortOrder !== 'none') {
                  return popularitySortOrder === 'asc'
                    ? a['Total Bids'] - b['Total Bids']
                    : b['Total Bids'] - a['Total Bids'];
                }
                if (bidsSortOrder !== 'none') {
                  return bidsSortOrder === 'asc'
                    ? a['Total Bids'] - b['Total Bids']
                    : b['Total Bids'] - a['Total Bids'];
                }
                if (priceSortOrder !== 'none') {
                  return priceSortOrder === 'asc'
                    ? a['Current/Final Price'] - b['Current/Final Price']
                    : b['Current/Final Price'] - a['Current/Final Price'];
                }
                if (dateSortOrder !== 'none') {
                  return dateSortOrder === 'asc'
                    ? new Date(a['Auction End Date']).getTime() - new Date(b['Auction End Date']).getTime()
                    : new Date(b['Auction End Date']).getTime() - new Date(a['Auction End Date']).getTime();
                }
                return 0; // Default
              })                                                        
              .map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item['Item ID']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item['Item Name']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    <img src={item['Item Image']} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item['Total Bids']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item['Status']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item['Current/Final Price']} USD</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    {calculateStars(item['Total Bids'], maxBids)}
                  </td>
                  <td
                    style={{
                      border: '1px solid #ddd',
                      padding: '10px',
                      textAlign: 'center',
                      fontWeight: 'bold', // Add bold font
                      fontStyle: 'italic', // Add italic font
                      color: item['Auction End Date'] > Math.floor(Date.now() / 1000) ? '#28a745' : '#dc3545', // Green for active, red for ended
                    }}
                  >
                    {item['Auction End Date'] > Math.floor(Date.now() / 1000)
                      ? calculateCountdown(item['Auction End Date'])
                      : 'Ended'}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={downloadCSV} style={{ marginTop: '20px' }}>Download Report as CSV</button>
        </div>
      ) : (
        <p>Loading data or no data available...</p>
      )}
    </div>
  );
}
