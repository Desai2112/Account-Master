import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Sidenav from '../Sidenav';
import axios from 'axios';
import Datacard from '../Components/Datacard';
import Graph from '../Components/Graph';
import '../Stylesheets/dashboard.css'; 

const dataCards = [
  { title: 'This month Sale', value: '100000 ₹' },
  { title: 'This Month Purchase', value: '85000 ₹' },
  { title: 'This month Profit', value: '15000 ₹' },
  { title: 'Previous month Sale', value: '97000 ₹' },
  { title: 'Previous Month Purchase', value: '86000 ₹' },
  { title: 'Previous Month Profit', value: '11000 ₹' },
];

const graphData = [
  { month: 'Jan', sales: 10000, purchases: 8000, profit: 2000 },
  { month: 'Feb', sales: 12000, purchases: 9000, profit: 3000 },
  { month: 'Mar', sales: 15000, purchases: 10000, profit: 5000 },
  { month: 'April', sales: 8000, purchases: 7000, profit: 1000 },
  // Add more months as needed
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
    };
    checkAuth();
  }, []);

  return (
    <Box className="main-container">
      <Sidenav />
      <Box className="main-content">
        <Typography variant="h4" className="dashboard-title">Dashboard</Typography>
        <div className="datacard-container">
          {dataCards.map((card, index) => (
            <Datacard key={index} title={card.title} value={card.value} />
          ))}
        </div>
        <div className="graph-container">
          <Graph data={graphData} />
        </div>
      </Box>
    </Box>
  );
};

export default Dashboard;
