// Import necessary elements
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Sidenav from '../Sidenav';
import axios from 'axios';
import '../Stylesheets/purchase.css';

const Sell = () => {
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
  });
  useEffect(() => {
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
    event.preventDefault();
  }
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
                <input type="text" name="sellerName" placeholder="Enter Buyer Name" value={formValues.buyerName} onChange={handleChange} required />
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
              <input type="number" name="igst" value={formValues.igst} onChange={handleChange}/>
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
      </Box>
    </Box>
  );
};

export default Sell;
