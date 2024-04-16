import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const DataCard = ({ title, value }) => {
  return (
    <Card style={{ marginBottom: '20px', width: '30%', marginRight: '2%' }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
}

export default DataCard;
