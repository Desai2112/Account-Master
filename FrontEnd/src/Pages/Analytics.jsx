import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Sidenav from '../Sidenav';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch analytics data from backend when the component mounts
        fetch('http://localhost:8081/analytics', { method: 'POST' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setAnalyticsData(data))
            .catch(error => {
                console.error('Error fetching analytics data:', error);
                setError('Error fetching data. Please try again later.');
            });
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidenav />
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="mt-2">Monthly Analysis</h1>
                        {error && <p className="error-message">{error}</p>}
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th className="col">Sr. No</th>
                                        <th className="col">Month-Year</th>
                                        <th className="col">Monthly-Sell</th>
                                        <th className="col">Purchase</th>
                                        <th className="col">Tax</th>
                                        <th className="col">Net Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyticsData.map((row, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{row.MonthYear}</td>
                                            <td>{row.MonthlySell}</td>
                                            <td>{row.MonthlyPurchase}</td>
                                            <td>{row.Tax}</td>
                                            <td>{row.NetProfit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    );
};

export default Analytics;
