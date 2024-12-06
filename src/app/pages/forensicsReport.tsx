import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ForensicsReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [forensicsReport, setForensicsReport] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const downloadCSV = () => {
    const headers = ["Item ID", "Item Name", "Total Bids", "Sale Price", "Buyer ID", "Seller ID", "Auction End Date", "Commission Earned"];
    const rows = forensicsReport.map(item => [
      item['Item ID'],
      item['Item Name'],
      item['Total Bids'],
      `${item['Sale Price']} USD`,
      item['Buyer'],
      item['Seller'],
      new Date(item['Auction End Date'] * 1000).toLocaleDateString(),
      `${item['Commission Earned']} USD`
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

  const fetchForensicsReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }
    try {
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

      const requestBody = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      const response = await axios.post(
        'https://9r1wd8xsk8.execute-api.us-east-1.amazonaws.com/forensics-report/forensics-report',
        JSON.stringify({ body: JSON.stringify(requestBody) }),
        { headers: { 'Content-Type': 'application/json' } }
      );

      const responseBody = JSON.parse(response.data.body);
      const data = Array.isArray(responseBody.forensicsReport) ? responseBody.forensicsReport : [];
      setForensicsReport(data);
      setIsDataFetched(true);
    } catch (error) {
      console.error('Failed to fetch auction report:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        {/* Back to Dashboard Button */}
        <div className="mb-4"></div>
        <Link to="/adminDashboard">
          <button className="btn btn-primary">
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <h1>Forensics Report</h1>
      {forensicsReport.length > 0 && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1em', fontFamily: 'Arial, sans-serif' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2', textAlign: 'center' }}>Item ID</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2', textAlign: 'center' }}>Item Name</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2', textAlign: 'center' }}>Total Bids</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2', textAlign: 'center' }}>Sale Price</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2', textAlign: 'center' }}>Buyer ID</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2', textAlign: 'center' }}>Seller ID</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2', textAlign: 'center' }}>Auction End Date</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', backgroundColor: '#f2f2f2', textAlign: 'center' }}>Commission Earned</th>
              </tr>
            </thead>
            <tbody>
              {forensicsReport.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item['Item ID']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item['Item Name']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item['Total Bids']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item['Sale Price']} USD</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item['Buyer']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item['Seller']}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    {new Date(item['Auction End Date'] * 1000).toLocaleDateString()}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                    {item['Commission Earned']} USD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={downloadCSV} style={{ marginTop: '20px' }}>
            Download Report as CSV
          </button>
        </div>
      )}
    </div>
  );
}
