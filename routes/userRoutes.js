const express = require('express');
const { getProfile, updateXP } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/profile', verifyToken, getProfile);
router.patch('/xp', verifyToken, updateXP);

module.exports = router;
