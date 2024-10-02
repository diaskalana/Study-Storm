const mongoose = require('mongoose');

const learnerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  enrolledCourses: {
    type: [String],
    default: []
  },
});

const Learner = mongoose.model('Learner', learnerSchema);

module.exports = Learner;
