import React from 'react';
import { Box, Typography } from '@mui/material';

const Datacard = ({ title, value }) => {
  return (
    <Box className="datacard">
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
};

export default Datacard;
