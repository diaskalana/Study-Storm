import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { learnerApi, courseApi } from "../../utils/api";
import { toast } from "react-toastify";
import MyCourseCard from './MyCourseCard'; // Importing the MyCourseCard component
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import confirmation dialog styles

const MyCoursesPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch user info from local storage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { email } = JSON.parse(userInfo);
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        if (userEmail) {
          setLoading(true);
          const response = await learnerApi.get(`/enrollment/enrolledCourses/${userEmail}`);
          const enrolledCourseIds = response.data.enrolledCourses;
          const promises = enrolledCourseIds.map(async (enrolledCourseId) => {
            const { data } = await courseApi.get(`/course/one/${enrolledCourseId}`);
            return data.payload;
          });
          const coursesData = await Promise.all(promises);
          setCourses(coursesData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setLoading(false);
        toast.error("Failed to fetch enrolled courses.");
      }
    };

    fetchEnrolledCourses();
  }, [userEmail]);

  const handleDeleteEnrollment = async (courseId) => {
    try {
      console.log('Deleting enrollment:', courseId, userEmail);
      const response = await learnerApi.delete(`/enrollment/cancel`, {
        data: { courseId, userEmail }
      });
  
      // Check if deletion was successful
      if (response.status === 200) {
        // Remove the course from the state
        setCourses(courses.filter(course => course.course_id !== courseId));
        toast.success("Enrollment cancelled successfully.");
      } else {
        toast.error("Failed to cancel enrollment.");
      }
    } catch (error) {
      console.error('Error cancelling enrollment:', error);
      toast.error("Failed to cancel enrollment.");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        My Courses
      </Typography>
      {loading ? (
        <Typography variant="body1">
          Loading...
        </Typography>
      ) : courses.length > 0 ? (
        <Grid container spacing={2} sx={{ paddingTop: 10 } }>
          {courses.map((course, index) => (
            <MyCourseCard key={index} course={course} onDelete={() => handleDeleteEnrollment(course.course_id)} />
          ))}
        </Grid>
      ) : (
        <Typography variant="body1">
          You haven't enrolled in any courses yet.
        </Typography>
      )}
    </Container>
  );
};

export default MyCoursesPage;
