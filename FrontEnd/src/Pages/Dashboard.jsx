// Import necessary elements
import React from 'react';
import { Box, Typography } from '@mui/material';
import Sidenav from '../Sidenav';


const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <h1>Dashboard</h1>
      </Box>
    </Box>
  );
};

export default Dashboard;
