const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.listen(8081, () => {
    console.log("Listening...");
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Om@2112#',
    database: 'account_master'
});

app.post('/login', (req, res) => {
    const sql = "SELECT UId, username FROM details WHERE username=? AND password=?";
    db.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error" });
        }
        if (data.length > 0) {
            return res.status(200).json({ success: true, message: "Login Successful", UId: data[0].UId });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});



app.post('/signup', (req, res) => {
    const checkEmail = "SELECT * FROM details WHERE email = ?";
    db.query(checkEmail, [req.body.email], (error, results) => {
        if (error) {
            console.error('Error executing query: ', error);
            return res.status(500).send('Error checking email in database');
        }
        if (results.length > 0) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        } else {
            const signUp = "INSERT INTO details (username, email, password) VALUES (?, ?, ?)";
            db.query(signUp, [req.body.username, req.body.email, req.body.password], (err, data) => {
                if (err) {
                    console.error('Error executing insert query: ', err);
                    return res.status(500).send('Error inserting data into database');
                }
                console.log('Data inserted successfully');
                res.status(200).json({ success: true, message: "Signup successful" });
            });
        }
    });
});

app.post('/purchase', (req, res) => {
    const purchase = "INSERT INTO Purchase (BillNo, ProductName, SellerName, Quantity, PricePerUnit, AmountWithoutTax, GSTNO, CGST, SGST, IGST, NetAmount, TransactionDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const { billNo, productName, sellerName, quantity, pricePerUnit, amountWithoutTax, gstNo, cgst, sgst, igst, totalAmount, date } = req.body.formValues;

    db.query(purchase, [billNo, productName, sellerName, quantity, pricePerUnit, amountWithoutTax, gstNo, cgst, sgst, igst, totalAmount, date], (err, data) => {
        if (err) {
            console.error('Error executing insert query: ', err);
            return res.status(500).send('Error inserting data into database');
        }
        console.log('Data inserted successfully');
        res.status(200).json({ success: true, message: "Purchase recorded successfully" });
    });

    const showdata="Select * from purchase"

    db.query(showdata , function(err, result){
        if(err){
            console.log("Error in fetching Purchase Data: ",err);
            return res.status(500).send('Error fetching Purchase data from database of purchase');
        }
     });
});


app.post('/analytics', (req, res) => {
    const analytics = "SELECT * FROM monthlySummary";
    db.query(analytics, (err, data) => {
        if (err) {
            console.error('Error executing analytics query: ', err);
            return res.status(500).send('Error fetching analytics data from database');
        }
        console.log('Analytics data fetched successfully');
        res.status(200).json(data); // Send analytics data as JSON response
    });
});

