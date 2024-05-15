import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Sidenav from '../Sidenav';
import axios from 'axios';
import Datacard from '../Components/Datacard';
import Graph from '../Components/Graph';
import '../Stylesheets/dashboard.css';

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [recommendedGraphData, setRecommendedGraphData] = useState([]);
  const [thisMonthData, setThisMonthData] = useState({ sales: 0, purchases: 0, profit: 0 });
  const [previousMonthData, setPreviousMonthData] = useState({ sales: 0, purchases: 0, profit: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token not found. Please log in.');
          return;
        }
  
        const authResponse = await axios.get('http://localhost:8081/checkAuth', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!authResponse.data.userId) {
          setError('User authentication failed.');
          return;
        }
        setUserId(authResponse.data.userId);
  
        // Fetch data for this month
        const thisMonthResponse = await axios.post('http://localhost:8081/datacard-this-month', null, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'userId': authResponse.data.userId
          }
        });
        console.log("This Month Data:", thisMonthResponse.data);
        // Check if data for this month is available
        if (thisMonthResponse.data.length > 0) {
          setThisMonthData(thisMonthResponse.data[0]);
        } else {
          // If data is not available, set default values
          setThisMonthData({ sales: '-', purchases: '-', profit: '-' });
        }
  
        // Fetch data for previous month
        const previousMonthResponse = await axios.post('http://localhost:8081/datacard-previous-month', null, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'userId': authResponse.data.userId
          }
        });
        console.log("Previous Month Data:", previousMonthResponse.data);
        // Check if data for previous month is available
        if (previousMonthResponse.data.length > 0) {
          setPreviousMonthData(previousMonthResponse.data[0]);
        } else {
          // If data is not available, set default values
          setPreviousMonthData({ sales: '-', purchases: '-', profit: '-' });
        }
  
        // Fetch recommended graph data
        const graphResponse = await axios.post('http://localhost:8081/dashboard-graph', null, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'userId': authResponse.data.userId
          }
        });
        setRecommendedGraphData(graphResponse.data);
      } catch (error) {
        setError('Error fetching data. Please try again later.');
        console.error(error);
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
          {/* <Typography variant="h6">This Month</Typography> */}
          <Datacard className="datacard" title="This Month Sales" value={thisMonthData.sales} />
          <Datacard className="datacard" title="This Month Purchases" value={thisMonthData.purchases} />
          <Datacard className="datacard" title="This Month Profit" value={thisMonthData.profit} />
  
          {/* <Typography variant="h6" style={{ marginTop: 20 }}>Previous Month</Typography> */}
          <Datacard className="datacard" title="Last Month Sales" value={previousMonthData.sales} />
          <Datacard className="datacard" title="Last Month Purchases" value={previousMonthData.purchases} />
          <Datacard className="datacard" title="Last Month Profit" value={previousMonthData.profit} />
        </div>
        <div className="graph-container">
          <Graph data={recommendedGraphData} />
        </div>
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Box>
  );
  
};

export default Dashboard;
