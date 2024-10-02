const express = require('express');
const ProgressController = require('../Controller/progressController');

const router = express.Router();

router.post('/tracking', ProgressController.addDoneProgress);
router.get('/tracking/:userEmail/:courseId', ProgressController.getDoneProgressByUserEmail);

module.exports = router;