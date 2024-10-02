import express from 'express';
import { createCourseContent, deleteCourseContent, getCourseContentById, getCourseContentList, updateCourseContent } from '../controllers/courseContentController.js';
import { authLvl1, authLvl2, authLvl3 } from '../middleware/authMiddleware.js';

const router = express.Router();

// Course Routes
router.post('/create', authLvl2, createCourseContent)
router.get('/all', getCourseContentList)
router.get('/one/:id', getCourseContentById)
router.put('/update', authLvl2, updateCourseContent)
router.delete('/delete/:id', authLvl2, deleteCourseContent)

export default router;
