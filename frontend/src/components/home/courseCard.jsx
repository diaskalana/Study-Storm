import { Link } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Grid, Button } from "@mui/material";

const CourseCard = ({ course }) => {
  const imageUrl = `${import.meta.env.VITE_COURSE_SERVER_URL}${course.thumbnail}`;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        onError={(event) => { event.target.src = "/default.png" }}
        alt={course.name}
      />
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {course.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {course.description}
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12}>
            {course.price === 0 ? (
              <Typography variant="subtitle2" color="primary">FREE</Typography>
            ) : (
              <>
                <Typography variant="subtitle2">Price:</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${course.price}
                </Typography>
              </>
            )}
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Level:</Typography>
            <Typography variant="body2" color="text.secondary">
              {course.level}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Type:</Typography>
            <Typography variant="body2" color="text.secondary">
              {course.type}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2">Duration:</Typography>
            <Typography variant="body2" color="text.secondary">
              {course.duration}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Grid container justifyContent="center" mt={2}>
        <Grid item xs={6}>
          <Link to={`/course-details/${course.course_id}`} style={{ textDecoration: 'none' }}>
            <Button fullWidth variant="contained" color="primary">
              Learn more
            </Button>
          </Link>
        </Grid>
        <Grid item xs={6}>
          <Button fullWidth variant="outlined" color="primary">
            Get started
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CourseCard;
