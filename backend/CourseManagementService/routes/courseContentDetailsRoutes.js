import express from 'express';
import { createCourseContentDetail, deleteCourseContentDetail, getCourseContentDetailList } from '../controllers/courseContentDetailController.js';
import { authLvl1, authLvl2, authLvl3 } from '../middleware/authMiddleware.js';
import { uploadCourseContent } from '../middleware/multer.js';

const router = express.Router();

// Course Routes
router.post('/create', authLvl2, uploadCourseContent.single('attatchment'), createCourseContentDetail)
router.get('/all', authLvl1, getCourseContentDetailList)
router.delete('/delete/:id', authLvl2, deleteCourseContentDetail)

export default router;
