import express from 'express';
import { approveCourse, createCourse, deleteCourse, getCourseById, getCourseList, getCourseListByInstructor, updateCourse } from '../controllers/courseController.js';
import { authLvl1, authLvl2, authLvl3 } from '../middleware/authMiddleware.js';
import { uploadThumbnail } from '../middleware/multer.js';

const router = express.Router();

// Course Routes
router.post('/create', authLvl2, uploadThumbnail.single('thumbnail'), createCourse)
router.get('/all', getCourseList)
router.get('/instructor/all', authLvl2, getCourseListByInstructor)
router.get('/one/:id', getCourseById)
router.put('/update', authLvl2, uploadThumbnail.single('thumbnail'), updateCourse)
router.patch('/approve/:id/:approve', authLvl3, approveCourse)
router.delete('/delete/:id', authLvl2, deleteCourse)

export default router;
