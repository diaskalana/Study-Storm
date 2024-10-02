const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  email: String,
  message: String,
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
