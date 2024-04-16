import React, { useState, useEffect, useContext } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import Sidenav from '../Sidenav';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../Stylesheets/purchase.css';


const Sell = () => {
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

  const [formValues, setFormValues] = useState({
    date: '',
    billNo: '',
    buyerName: '',
    gstNo: '',
    productName: '',
    quantity: '',
    pricePerUnit: '',
    cgst: '',
    sgst: '',
    igst: '',
    amountWithoutTax: '0',
    taxAmount: '0',
    totalAmount: '0',
    UID:  userId ? userId : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingsells, setLoadingsells] = useState(false);
  const [sells, setSells] = useState([]);
  const fetchsells = async () => {
    setLoadingsells(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get('http://localhost:8081/sell-data', config);      setSells(response.data);
      console.log(sells)
      setSells(response.data)
      setLoadingsells(false);
    } catch (err) {
      console.error('Failed to fetch sells:', err);
      setError('Failed to fetch sell data. Please try again later.');
      setLoadingsells(false);
    }
  };
  useEffect(() => {
    fetchsells();
    if (formValues.quantity && formValues.pricePerUnit && (formValues.cgst || formValues.sgst || formValues.igst)) {
      const quantity = parseFloat(formValues.quantity);
      const pricePerUnit = parseFloat(formValues.pricePerUnit);
      const cgst = parseFloat(formValues.cgst);
      const sgst = parseFloat(formValues.sgst);
      const igst = parseFloat(formValues.igst) || 0;

      const amountWithoutTax = quantity * pricePerUnit;
      const taxAmount = (amountWithoutTax * (cgst + sgst + igst)) / 100;
      const totalAmount = amountWithoutTax + taxAmount;

      setFormValues((prevValues) => ({
        ...prevValues,
        amountWithoutTax: amountWithoutTax.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      }));
    }
  }, [formValues.quantity, formValues.pricePerUnit, formValues.cgst, formValues.sgst, formValues.igst]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleSubmit = (event) => {
    console.log(formValues)
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
      // Handle token not found error (e.g., redirect to login page)
      return;
    }
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    axios.post(`http://localhost:8081/sell`, formValues,config)
      .then(res => {
        console.log('Sell data submitted successfully:', res.data);
        setSells(res.data);
        console.log(res.data)
        fetchsells();
        handleReset();
      })
      .catch(err => {
        console.error(err);
        alert("Failed to submit the data: " + err.message);
      });
  };
  const handleReset = () => {
    setFormValues({
      date: '',
      billNo: '',
      buyerName: '',
      gstNo: '',
      productName: '',
      quantity: '',
      pricePerUnit: '',
      cgst: '',
      sgst: '',
      igst: '',
      amountWithoutTax: '0',
      taxAmount: '0',
      totalAmount: '0',
    });
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidenav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <h1>Sell</h1>
        <form onSubmit={handleSubmit}>
          <div className="container">
            <div className="date">
              <label>Date:</label>
              <input type="date" name="date" value={formValues.date} onChange={handleChange} required />
            </div>
            <div className="billno">
              <label>Enter Bill No:</label>
              <input type="text" name="billNo" value={formValues.billNo} onChange={handleChange} placeholder='Enter Bill No.' required />
            </div>
            <div className="bname">
              <label>Buyer Name:</label>
              <input type="text" name="buyerName" placeholder="Enter Buyer Name" value={formValues.buyerName} onChange={handleChange} required />
            </div>
            <div className="gno">
              <label>GST No.:</label>
              <input type="text" name="gstNo" placeholder="Enter GST No." value={formValues.gstNo} onChange={handleChange} required />
            </div>
            <div className="pname">
              <label>Product Name:</label>
              <input type="text" name="productName" placeholder="Enter Product Name" value={formValues.productName} onChange={handleChange}
                required />
            </div>
            <div className="flex">
              <div className="qnt">
                <label>Quantity:</label>
                <input type="number" name="quantity" value={formValues.quantity} onChange={handleChange} required />
              </div>
              <div className="ppu">
                <label>Price Per Unit:</label>
                <input type="number" name="pricePerUnit" value={formValues.pricePerUnit} onChange={handleChange} required />
              </div>
            </div>
            <div className="flex">
              <div className="gst">
                <label>CGST (%):</label>
                <input type="number" name="cgst" value={formValues.cgst} onChange={handleChange} required />
              </div>
              <div className="gst">
                <label>SGST (%):</label>
                <input type="number" name="sgst" value={formValues.sgst} onChange={handleChange} required />
              </div>
              <div className="gst">
                <label>IGST (%):</label>
                <input type="number" name="igst" value={formValues.igst} onChange={handleChange} />
              </div>
            </div>
            <div className="AWOT">
              <label>Amount without Tax:</label>
              <input type="number" name="amountWithoutTax" value={formValues.amountWithoutTax} readOnly />
            </div>
            <div className="amt">
              <label>Tax Amount:</label>
              <input type="number" name="taxAmount" value={formValues.taxAmount} readOnly />
            </div>
            <div className="tamt">
              <label>Total Amount:</label>
              <input type="number" name="totalAmount" value={formValues.totalAmount} readOnly />
            </div>
            <div>
              <button type="submit" className="submit">Submit</button>
              <button type="reset" className="reset" onClick={() => setFormValues({
                date: '',
                sellerName: '',
                gstNo: '',
                productName: '',
                quantity: '',
                pricePerUnit: '',
                gst: '',
                amountWithoutTax: '0',
                taxAmount: '0',
                totalAmount: '0',
              })}>Reset</button>
            </div>
          </div>
        </form>

        <br />
        <br />
        <h1>Previous Sell Records</h1>
        <br />
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="col">Bill No</th>
                <th className="col">Seller Name</th>
                <th className="col">GST No</th>
                <th className="col">Product Name</th>
                <th className="col">Quantity</th>
                <th className="col">Price of Unit</th>
                <th className="col">CGST</th>
                <th className="col">SGST</th>
                <th className="col">IGST</th>
                <th className="col">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(sells) && sells.map((sell, index) => (
                <tr key={index}>
                  <td>{sell.BillNo}</td>
                  <td>{sell.CustomerName}</td>
                  <td>{sell.GSTNO}</td>
                  <td>{sell.ProductName}</td>
                  <td>{sell.Quantity}</td>
                  <td>{sell.PricePerUnit}</td>
                  <td>{sell.CGST}</td>
                  <td>{sell.SGST}</td>
                  <td>{sell.IGST}</td>
                  <td>{sell.NetAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>
    </Box>
  );
};

export default Sell;
