const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Establish a database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Om@2112#',
    database: 'account_master'
});

// Start the Express server
app.listen(8081, () => {
    console.log("Listening on port 8081...");
});

// Login route
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM details WHERE username=? AND password=?";
    db.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error" });
        }
        if (data.length > 0) {
            const userId = data[0].UId;
            const token = jwt.sign({ userId }, "jwtSecretKey", { expiresIn: '3h' });
            return res.status(200).json({ success: true, message: "Login Successful", token });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});

// Signup route
app.post('/signup', (req, res) => {
    const checkEmail = "SELECT * FROM details WHERE email =?";
    db.query(checkEmail, [req.body.email], (error, results) => {
        if (error) {
            console.error("Error executing query: ", error);
            res.status(500).send('Error checking email in database');
        } else if (results.length > 0) {
            res.status(409).json({ success: false, message: "Email already exists" });
        } else {
            const signUp = "INSERT INTO details (username, email, password) VALUES (?,?,?)";
            db.query(signUp, [req.body.username, req.body.email, req.body.password], (err, data) => {
                if (err) {
                    console.error('Error executing insert query: ', err);
                    res.status(500).send('Error inserting data into database');
                } else {
                    console.log('User inserted successfully');
                    res.status(200).json({ success: true, message: "Signup successful" });
                }
            });
        }
    });
});

// Check Auth Middleware
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json("We need a token; please provide it.");
    } else {
        jwt.verify(token, "jwtSecretKey", (err, decoded) => {
            if (err) {
                return res.status(403).json("Not authenticated.");
            } else {
                req.userId = decoded.userId;
                next();
            }
        });
    }
};


app.get('/checkAuth', verifyJWT, (req, res) => {
    // If this middleware runs, it means the user is authenticated
    return res.json({ authenticated: true, userId: req.userId });
});

// Purchase route
app.post('/purchase', verifyJWT, (req, res) => {
    const purchaseQuery = "INSERT INTO Purchase (UId, BillNo, ProductName, SellerName, Quantity, PricePerUnit, AmountWithoutTax, GSTNO, CGST, SGST, IGST, NetAmount, TransactionDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(purchaseQuery, [req.userId, req.body.billNo, req.body.productName, req.body.sellerName, req.body.quantity, req.body.pricePerUnit, req.body.amountWithoutTax, req.body.gstNo, req.body.cgst, req.body.sgst, req.body.igst, req.body.totalAmount, req.body.date], (err, result) => {
        if (err) {
            console.error('Error executing insert query: ', err);
            return res.status(500).send('Error inserting data into database');
        }
        console.log('Data inserted successfully', result);
        res.status(200).json({ success: true, message: "Purchase recorded successfully", data: result });
    });
});

// Route to fetch Purchase Data
app.get('/purchase-data', verifyJWT, (req, res) => {
    const query = 'SELECT * FROM Purchase where UId=?';
    db.query(query, [req.userId], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).send('Error fetching Purchase data from database');
        } else {
            console.log("Purchase data fetched Successfully for user ", req.userId);
            res.status(200).json(result);
        }
    });
});

// Sell Route
app.post('/sell', verifyJWT, (req, res) => {
    const sellQuery = "INSERT INTO sell (UId, BillNo, ProductName, CustomerName, Quantity, PricePerUnit, AmountWithoutTax, GSTNO, CGST, SGST, IGST, NetAmount, TransactionDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sellQuery, [req.userId, req.body.billNo, req.body.productName, req.body.buyerName, req.body.quantity, req.body.pricePerUnit, req.body.amountWithoutTax, req.body.gstNo, req.body.cgst, req.body.sgst, req.body.igst, req.body.totalAmount, req.body.date], (err, result) => {
        if (err) {
            console.error('Error executing insert query: ', err);
            res.status(500).send('Error inserting data into database');
        } else {
            console.log('Data inserted successfully', result);
            res.status(200).json({ success: true, message: "Sell recorded successfully", data: result });
        }
    });
});

// Route to fetch sell data
app.get('/sell-data',verifyJWT, (req, res) => {
    db.query('SELECT * FROM sell where UId=?',[req.userId], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).send('Error fetching Sell data from database');
        } else {
            console.log("Sell data fetched Successfully.");
            res.status(200).json(result);
        }
    });
});

// Analytics route
app.post('/analytics', verifyJWT, (req, res) => {
    const analytics = "SELECT * FROM monthlySummary where UId=?";
    db.query(analytics, [req.userId],(err, data) => {
        if (err) {
            console.error('Error executing analytics query: ', err);
            res.status(500).send('Error fetching analytics data from database');
        } else {
            console.log('Analytics data fetched successfully');
            res.status(200).json(data);
        }
    });
});

// DashBoard Graph Data
app.post('/dashboard-graph', verifyJWT, (req, res) => {
    const userId = req.userId; // Extract userId from the JWT token

    const query = 'SELECT MonthYear, MonthlySell, MonthlyPurchase, NetProfit FROM MonthlySummary WHERE UId = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching MonthlySummary data:', err);
            res.status(500).json({ error: 'Error fetching MonthlySummary data' });
        } else {
            // Format the data as needed
            const formattedData = result.map(row => ({
                month: row.MonthYear, // Assuming MonthYear is in 'Jan-2024' format
                sales: row.MonthlySell,
                purchases: row.MonthlyPurchase,
                profit: row.NetProfit
            }));
            console.log("Graph data fetched successfully");
            console.log(formattedData);
            res.status(200).json(formattedData);
        }
    });
});
