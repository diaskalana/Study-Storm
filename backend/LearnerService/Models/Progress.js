const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  pdfIds: {
    type: [String],
    required: true,
  }
});

module.exports = mongoose.model('Progress', progressSchema);