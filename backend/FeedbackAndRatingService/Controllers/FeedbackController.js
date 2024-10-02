const Feedback = require('../Model/Feedback');

exports.addFeedback = async (req, res) => {
  try {
    const { userEmail, courseId, rating, comment } = req.body;
    const feedback = await Feedback.create({ userEmail, courseId, rating, comment });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
    try {
      const feedback = await Feedback.findById(req.params.id);
      if (!feedback) {
        return res.status(404).json({ error: 'Feedback not found' });
      }
      // Check if the logged-in user is the same as the feedback creator
      if (feedback.user !== req.body.user) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      await Feedback.deleteOne({ _id: feedback._id }); // or Feedback.findByIdAndDelete(feedback._id);
      res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
exports.updateFeedback = async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const feedback = await Feedback.findByIdAndUpdate(req.params.id, { rating, comment }, { new: true });
      if (!feedback) {
        return res.status(404).json({ error: 'Feedback not found' });
      }
      // Check if the logged-in user is the same as the feedback creator
      if (feedback.user !== req.body.user) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.getFeedbackByCourseId = async (req, res) => {
    try {
      const courseId = req.params.id;
      const feedback = await Feedback.find({ courseId });
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };