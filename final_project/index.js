const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configure session middleware
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Middleware to protect authenticated routes
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access. Token is missing" });
    }
    try {
        const decode = jwt.verify(token, "fingerprint_customer");
        req.user = decode;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Forbidden. Invalid token." });
    }
});

// Mount the routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
