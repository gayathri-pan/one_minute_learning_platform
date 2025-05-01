const express = require('express');
const router = express.Router();
const {
    addContent,
    getContent,
    markContentOngoing,
    markContentCompleted,
    getOngoingCourses,
    getCompletedCourses,
    enrollInCourse,
    completeCourse,
    getUserProfile,
    getContentById
    
} = require('../controllers/contentController');

router.post('/', addContent);
router.get('/', getContent);
router.patch('/ongoing/:contentId', markContentOngoing);
router.patch('/completed/:contentId', markContentCompleted);
router.get('/ongoing/:userId', getOngoingCourses);
router.get('/completed/:userId', getCompletedCourses);
router.post('/enroll/:userId/:courseId', enrollInCourse);
router.post('/complete/:userId/:courseId', completeCourse);
router.get('/profile/:userId', getUserProfile);
router.get('/:id', getContentById);
module.exports = router;