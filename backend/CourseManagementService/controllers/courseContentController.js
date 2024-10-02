import asyncHandler from 'express-async-handler';
import fs from 'fs';
import Courses from '../models/courseModel.js';
import CourseContents from '../models/courseContentModel.js';


// @desc    Create new Course Content
// route    POST /api/course/content/create
// @access  Private - Auth Lvl 2
const createCourseContent = asyncHandler(async (req, res) => {
    try {

        const {
            course_id,
            title,
            subtitle,
            desc
        } = req.body;

        
        try {
            if(!course_id){
                throw new Error('Course Id is required');                
            } else if(!title){
                throw new Error('Course Content Title is required');                
            }
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        var course = await Courses.findByPk(course_id);
        if(!course){
            return res.status(404).json({ message: 'Course Not Found!' });            
        }

        var courseContent = await CourseContents.findOne({ where: { title } });

        if(courseContent){
            return res.status(400).json({ message: 'Course Content Already Exists' });            
        }
    
        courseContent = await CourseContents.create({
            course_id,
            title,
            subtitle,
            desc
        });
    
        if(courseContent){
            return res.status(201).json({ message: 'Course Content Created Successfully', payload: courseContent });            
        }else{
            return res.status(400).json({ message: 'Course Content Creation Unsuccessful' });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

});


// @desc    Retrieve All Course Contents
// route    GET /api/course/content/all
// @access  Public
const getCourseContentList = asyncHandler(async (req, res) => {
    
    try {

        const page = parseInt(req.query.page)-1;
        const rows = parseInt(req.query.rows);
        const course_id = parseInt(req.query.course_id);

        let courseContents = await CourseContents.findAndCountAll({offset: page, limit: rows, where: { course_id }});

        if(courseContents.count <= 0){
            return res.status(404).json({ message: 'No Course Content Available!' });            
        }
        
        return res.status(200).json({ message: 'Course Contents Retreived Successfully', payload: courseContents });

    } catch (error) {

        return res.status(500).json({ message: error.message })

    }

});


// @desc    Retrieve Course Contents By Id
// route    GET /api/course/content/one/:id
// @access  Public
const getCourseContentById = asyncHandler(async (req, res) => {
    
    try {

        const id = parseInt(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({ message: 'Invalid Course Content Id!' });
             
        }

        let courseContent = await CourseContents.findByPk(id)

        if(!courseContent){
            return res.status(404).json({ message: 'Course Content Not Found!' });
        }

        return res.status(200).json({ message: 'Course Content Retreived Successfully', payload: courseContent });

    } catch (error) {

        return res.status(500).json({ message: error.message })
        

    }

});


// @desc    Update Course Content Details
// route    PUT /api/course/content/update
// @access  Private - Auth Lvl 2
const updateCourseContent = asyncHandler(async (req, res) => {

    try {

        const {
            content_id,
            title,
            subtitle,
            desc
        } = req.body;
    
        let courseContent = await CourseContents.findByPk(content_id)
    
        if (!content_id) {
            return res.status(404).json({ message: 'Course Content Not Found!' })
        }
    
        courseContent = await CourseContents.update(
            { 
                title: title || courseContent.title,
                subtitle: subtitle || null,
                desc: desc || null
            },
            {
              where: {
                content_id: content_id,
              },
            },
        );
        
        return res.status(200).json({ message: 'Course Content Updated Successfully' });

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
});


// @desc    Delete Course Content 
// route    DELETE /api/course/content/delete/:id
// @access  Private - Auth Lvl 2
const deleteCourseContent = asyncHandler(async (req, res) => {

    try {

        const id = parseInt(req.params.id);

        let courseContent = await CourseContents.findByPk(id);
        if(!courseContent){
            return res.status(404).json({ message: "Course Content Not Found!" })
        }

        courseContent = await CourseContents.destroy({
            where: {
                content_id: id,
            },
        });
        
        return res.status(200).json({ message: 'Course Content Deleted Successfully' });
        

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
});




export { 
    createCourseContent,
    getCourseContentList,
    getCourseContentById,
    updateCourseContent,
    deleteCourseContent
};
