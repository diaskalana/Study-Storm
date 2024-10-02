const express = require('express');
const LearnerController = require('../Controller/learnerController');

const router = express.Router();

router.post('/enroll', LearnerController.enrollCourse);
router.get('/enrolledCourses/:userEmail', LearnerController.getEnrolledCoursesByUserEmail);
router.delete('/cancel', LearnerController.cancelEnrollment);
router.get('/progress/:userEmail', LearnerController.trackProgress);
router.get('/usersByCourse/:courseId', LearnerController.getUsersByCourseId);

module.exports = router;
