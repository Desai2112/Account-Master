import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Sidenav from '../Sidenav';
import axios from 'axios';
import Datacard from '../Components/Datacard';
import Graph from '../Components/Graph';
import '../Stylesheets/dashboard.css';

const dataCards = [
  { title: 'This Month Purchase', value: '85000 ₹' },
  { title: 'This month Sale', value: '100000 ₹' },
  { title: 'This month Profit', value: '15000 ₹' },
  { title: 'Previous Month Purchase', value: '86000 ₹' },
  { title: 'Previous month Sale', value: '97000 ₹' },
  { title: 'Previous Month Profit', value: '11000 ₹' },
];

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [recommendedGraphData, setRecommendedGraphData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            // Check authentication
            const authResponse = await axios.get('http://localhost:8081/checkAuth', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const { userId } = authResponse.data;
            if (!userId) {
                console.error('userId not found in response data');
                return;
            }
            setUserId(userId);
            console.log('User ID:', userId);

            // Fetch recommended graph data
            const graphResponse = await axios.post('http://localhost:8081/dashboard-graph', null, {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'userId': userId
              }
          });
          
            setRecommendedGraphData(graphResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data. Please try again later.');
        }
    };

    fetchData();
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
          <Graph data={recommendedGraphData} />
        </div>
      </Box>
    </Box>
  );
};

export default Dashboard;
