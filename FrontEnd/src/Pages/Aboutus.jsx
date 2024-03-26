// Import necessary elements
import React from 'react';
import { Box, Typography } from '@mui/material';
import Sidenav from '../Sidenav';


const Aboutus = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <h1>About Us</h1>
      </Box>
    </Box>
  );
};

export default Aboutus;
