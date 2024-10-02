import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, IconButton } from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const MyCourseCard = ({ course, onDelete }) => {

  const handleDeleteClick = () => {
    // Show confirmation dialog
    confirmAlert({
      title: 'Confirm deletion',
      message: 'Are you sure you want to delete this enrollment?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => onDelete(course.course_id)
        },
        {
          label: 'No',
          onClick: () => {} // Do nothing if "No" is clicked
        }
      ]
    });
  };

  return (
    <Grid item xs={12} md={6} lg={12}>
      <Card elevation={1} style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: '20px', border: '1px solid #f3d607', borderRadius: '5px', margin: '0px 0px' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} md={12} lg={3}>
              <CardMedia
                component="img"
                src={`${import.meta.env.VITE_COURSE_SERVER_URL}${course.thumbnail}`}
                onError={(event) => { event.target.src = "/default-course-image.jpg" }}
                alt={course.name}
                style={{ width: '100%', height: 'auto', maxHeight: '350px', objectFit: 'contain', borderRadius: '5px' }}
              />
            </Grid>
            <Grid item xs={12} sm={9} md={12} lg={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} textAlign={'right'}>
                  <IconButton onClick={handleDeleteClick}>
                    <Delete />
                  </IconButton>
                  {/* Use Link to navigate to the course */}
                  <Link to={`/learner/course/${course.course_id}`}>
                    <IconButton>
                      <Visibility />
                    </IconButton>
                  </Link>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Typography fontSize={25}>{course.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{course.description}</Typography>
                  <Typography variant="body2" color="text.secondary">Start Date: {new Date(course.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                  <Typography variant="body2" color="text.secondary">Price: {course.price === 0 ? 'FREE' : `$${course.price}`}</Typography>
                  <Typography variant="body2" color="text.secondary">Level: {course.level}</Typography>
                  <Typography variant="body2" color="text.secondary">Type: {course.type}</Typography>
                  <Typography variant="body2" color="text.secondary">Duration: {course.duration}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default MyCourseCard;
