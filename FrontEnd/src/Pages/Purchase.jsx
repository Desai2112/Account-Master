import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import Sidenav from '../Sidenav';
import axios from 'axios';
import '../Stylesheets/purchase.css';

const Purchase = () => {

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
    sellerName: '',
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
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [purchases, setPurchases] = useState([]);

  const fetchPurchases = async () => {
    setLoadingPurchases(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get('http://localhost:8081/purchase-data', config);
      setPurchases(response.data);
      setLoadingPurchases(false);
    } catch (err) {
      console.error('Failed to fetch purchases:', err);
      setError('Failed to fetch purchase data. Please try again later.');
      setLoadingPurchases(false);
    }
  };
  

  useEffect(() => {
    fetchPurchases();
    if (formValues.quantity && formValues.pricePerUnit && (formValues.cgst || formValues.sgst || formValues.igst)) {
      const quantity = parseFloat(formValues.quantity);
      const pricePerUnit = parseFloat(formValues.pricePerUnit);
      const cgst = parseFloat(formValues.cgst) || 0;
      const sgst = parseFloat(formValues.sgst) || 0;
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
    console.log(formValues);
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
  
    axios.post(`http://localhost:8081/purchase`, formValues, config)
      .then(res => {
        console.log('Purchase data submitted successfully:', res.data);
        setPurchases(res.data);
        fetchPurchases();
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
      sellerName: '',
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
        <h1>Purchase</h1>
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
            <div className="sname">
              <label>Seller Name:</label>
              <input type="text" name="sellerName" placeholder="Enter Seller Name" value={formValues.sellerName} onChange={handleChange} required />
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
                <input type="number" name="igst" value={formValues.igst} onChange={handleChange} required />
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
              <button type="submit" className="submit" disabled={loading}>
                {loading ? <CircularProgress size={10} /> : 'Submit'}
              </button>
              <button type="button" className="reset" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </form>

        <br />
        <br />
        <h1>Previous Purchase Records</h1>
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

              {Array.isArray(purchases) && purchases.map((purchase, index) => (
                <tr key={index}>
                  <td>{purchase.BillNo}</td>
                  <td>{purchase.SellerName}</td>
                  <td>{purchase.GSTNO}</td>
                  <td>{purchase.ProductName}</td>
                  <td>{purchase.Quantity}</td>
                  <td>{purchase.PricePerUnit}</td>
                  <td>{purchase.CGST}</td>
                  <td>{purchase.SGST}</td>
                  <td>{purchase.IGST}</td>
                  <td>{purchase.NetAmount}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </Box>
    </Box>
  );
};

export default Purchase;
