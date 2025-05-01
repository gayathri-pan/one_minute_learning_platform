// routes/protected.js
const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware'); // Correct path to authMiddleware

// Define a protected route for normal users
router.get('/user', verifyToken, (req, res) => {
  res.json({ message: `Hello User ${req.userId}`, role: req.role });
});

// Define a protected route for admins
router.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: 'Hello Admin' });
});

module.exports = router;
