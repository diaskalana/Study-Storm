const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/send-notification', notificationController.sendNotification);
router.post('/send-sms', notificationController.sendSMSNotification);

// get all notifications for a specific email
router.get('/notifications', notificationController.getNotifications);

router.post('/send-email', notificationController.sendOtpEmail);

module.exports = router;
