const express = require('express');
const router = express.Router();
const {
    addContent,
    markContentOngoing,
    markContentCompleted,
    getOngoingCourses
} = require('../controllers/contentController');

router.post('/', addContent);
router.patch('/ongoing/:contentId', markContentOngoing);
router.patch('/completed/:contentId', markContentCompleted);
router.patch('/ongoing/:userId', getOngoingCourses);
router.patch('/completed/:userId', getCompletedCourses);
module.exports = router;