import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Graph = ({ data }) => {
  // Find the maximum value among purchases, sales, and profit
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.purchases, item.sales, item.profit))
  );

  // Set a buffer for the Y-axis domain to ensure some padding above the maximum value
  const buffer = 1000; // Adjust as needed
  
  // Calculate the upper bound for the Y-axis domain
  const yMax = Math.ceil((maxValue + buffer) / 1000) * 1000; // Round up to the nearest thousand
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Purchases, Sales, and Profit Trend</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, yMax]} /> {/* Set the Y-axis domain */}
            <Tooltip />
            <Legend />
            <Bar dataKey="purchases" fill="#82ca9d" name="Purchases" />
            <Bar dataKey="sales" fill="#8884d8" name="Sales" />
            <Bar dataKey="profit" fill="#ffc658" name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default Graph;
