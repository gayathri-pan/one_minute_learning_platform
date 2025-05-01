const express = require('express');
const router = express.Router();
module.exports = router;
const { verifyToken } = require('../middlewares/authMiddleware');

const {
    getProfile,
    updateXP
    
} = require('../controllers/userController');

router.get('/profile/', verifyToken, getProfile);
router.patch('/xp', verifyToken, updateXP);
