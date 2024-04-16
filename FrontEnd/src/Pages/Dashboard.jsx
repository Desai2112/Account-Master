// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Sidenav from '../Sidenav';
import axios from 'axios';
import Datacard from '../Components/Datacard'
import Graph from '../Components/Graph';

const dataCards = [
{ title: 'Sales Revenue', value: '$10,000' },
{ title: 'Total Orders', value: '100' },
{ title: 'Average Order Value', value: '$100' },
{ title: 'New Customers', value: '50' },
{ title: 'Total Inventory Value', value: '$20,000' },
{ title: 'Out-of-stock Products', value: '10' }
];

// Mock data for graph
const graphData = [
  { name: 'Jan', value: 1000 },
  { name: 'Feb', value: 1500 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2500 },
  { name: 'May', value: 3000 },
  { name: 'Jun', value: 3500 }
];

const Dashboard = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }
      axios.get('http://localhost:8081/checkAuth', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        const { userId } = res.data;
        if (!userId) {
          console.error("userId not found in response data");
          return;
        }
        setUserId(userId);
        console.log("User ID:", userId);
      })
      .catch(err => console.error("Error fetching userId:", err));
    }
    checkAuth();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <h2>Dashboard</h2>

    <div>
      <div>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {dataCards.map((card, index) => (
        <Datacard key={index} title={card.title} value={card.value} />
      ))}
    </Box>
        <Graph data={graphData} />
      </div>
    </div>
      </Box>
    </Box>
  );
};

export default Dashboard;
