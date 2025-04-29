const express = require('express');
const router = express.Router();
const {
    addContent,
    markContentOngoing,
    markContentCompleted
} = require('../controllers/contentController');

router.post('/', addContent);
router.patch('/ongoing/:contentID', markContentOngoing);
router.patch('/complete/:contentId', markContentCompleted);

module.exports = router;