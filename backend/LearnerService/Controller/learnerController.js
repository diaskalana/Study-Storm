const Learner = require('../Models/learnerModel');


const learnerController = {
  enrollCourse : async (req, res) => {
    try {
      const { courseId, userEmail } = req.body;
      
      // Find the learner by email
      let learner = await Learner.findOne({ email: userEmail });
      if (!learner) {
        // Create a new learner if not found
        learner = new Learner({ email: userEmail });
      }
      
      // Check if the learner is already enrolled in this course
      if (learner.enrolledCourses && learner.enrolledCourses.includes(courseId)) {
        return res.status(400).json({ message: 'Learner already enrolled in this course' });
      }
      
      // Enroll the learner in the course
      learner.enrolledCourses = [...(learner.enrolledCourses || []), courseId];
      await learner.save();
      
      return res.status(200).json({ message: 'Course enrollment successful', learner });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getEnrolledCoursesByUserEmail: async (req, res) => {
    try {
      const { userEmail } = req.params;
      
      // Find the learner by email
      const learner = await Learner.findOne({ email: userEmail });
      if (!learner) {
        return res.status(404).json({ message: 'Learner not found' });
      }
      
      // Return the enrolled courses of the learner
      return res.status(200).json({ enrolledCourses: learner.enrolledCourses });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  

cancelEnrollment: async (req, res) => {
  try {
    const { courseId, userEmail } = req.body; // Change courseId, learnerId to courseId, userEmail
    
    // Find the learner by email
    const learner = await Learner.findOne({ email: userEmail });
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }
    
    // Check if the learner is enrolled in the course
    const index = learner.enrolledCourses.indexOf(courseId);
    if (index === -1) {
      return res.status(400).json({ message: 'Learner is not enrolled in this course' });
    }
    
    // Remove the course from the enrolledCourses array
    learner.enrolledCourses.splice(index, 1);
    await learner.save();
    
    return res.status(200).json({ message: 'Course enrollment canceled successfully', learner });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
},
getUsersByCourseId: async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find all learners who are enrolled in the specified course
    const learners = await Learner.find({ enrolledCourses: courseId }, 'email');

    // Extract emails from the learners
    const userEmails = learners.map(learner => learner.email);

    return res.status(200).json({ userEmails });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
},

trackProgress: async (req, res) => {
  try {
    const { userEmail } = req.params; // Change learnerId to userEmail
    
    // Find the learner by email
    const learner = await Learner.findOne({ email: userEmail });
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }
    
    // Return the learner
    return res.status(200).json({ learner });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
},
};

module.exports = learnerController;
