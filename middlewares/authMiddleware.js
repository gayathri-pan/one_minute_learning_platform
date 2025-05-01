const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    if (!token) return res.status(401).json({message: 'Unauthorized'});
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({message: 'Invalid token'});
    }
}

const verifyAdmin = (req, res, next) => {
    if (req.role !== 'admin'){
        return res.status(403).json({message: 'Admin access only'});
    }
    next();
}

module.exports = { verifyToken, verifyAdmin };