const express = require('express');
const router = express.Router();
const feedbackController = require('../Controllers/FeedbackController');

router.post('/add', feedbackController.addFeedback);
router.delete('/:id', feedbackController.deleteFeedback);
router.put('/:id', feedbackController.updateFeedback);
router.get('/course/:id', feedbackController.getFeedbackByCourseId);

module.exports = router;