const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Feedback', feedbackSchema);