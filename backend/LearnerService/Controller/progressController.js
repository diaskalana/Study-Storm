const Progress = require('../Models/Progress');

const ProgressController = {
    addDoneProgress: async (req, res) => {
        try {
          const { courseId, userEmail, pdfIds } = req.body;
    
          // Find the progress for the given user email and course ID
          let progress = await Progress.findOne({ courseId, userEmail });
    
          if (!progress) {
            // If progress doesn't exist, create a new entry
            progress = new Progress({ courseId, userEmail });
          }
          
          // Check if any of the provided PDF IDs already exist in the progress array
          const duplicatePdfIds = pdfIds.filter(id => progress.pdfIds.includes(id));
          if (duplicatePdfIds.length > 0) {
            return res.status(400).json({ message: 'Cannot add the same PDF ID multiple times' });
          }
    
          // Append the new PDF IDs to the progress array
          progress.pdfIds.push(...pdfIds);
    
          // Save the updated progress
          await progress.save();
          
          return res.status(201).json({ message: 'Progress tracking successful' });
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      },

  getDoneProgressByUserEmail: async (req, res) => {
    try {
      const { userEmail, courseId } = req.params;
      
      const progress = await Progress.findOne({ userEmail, courseId });
      if (!progress) {
        return res.status(404).json({ message: 'Progress not found' });
      }
      
      return res.status(200).json({ progress });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = ProgressController;
