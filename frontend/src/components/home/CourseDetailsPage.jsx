import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Card, CardContent, CardMedia, Grid, Button, Divider, TextField, Rating, IconButton, Modal, Box, Checkbox, FormControlLabel } from "@mui/material";
import { courseApi, feedbackApi } from "../../utils/api";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: ""
  });
  const [averageRating, setAverageRating] = useState(0);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [openAddFeedbackModal, setOpenAddFeedbackModal] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [selectedStarFilters, setSelectedStarFilters] = useState([]); // State to hold selected star rating filters
  const [starFilter, setStarFilter] = useState(0); // State to track selected star rating filter

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      const { data } = await feedbackApi.get(`/feedback/course/${id}`);
      setFeedbacks(data);
      calculateAverageRating(data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUserEmail(localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")).email : null);
  }, []);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setIsLoading(true);
        const { data } = await courseApi.get(`/course/one/${id}`);
        setCourseDetails(data.payload);
        toast.success(data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
    fetchFeedbacks();
  }, [id]);

  const calculateAverageRating = (feedbacks) => {
    if (feedbacks.length === 0) {
      setAverageRating(0);
      return;
    }

    const totalRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    const avgRating = totalRating / feedbacks.length;
    setAverageRating(avgRating);
  };

  const handleGetStarted = () => {
    if (currentUserEmail) {
      const paymentUrl = `${import.meta.env.VITE_PAYMENT_SERVER_URL}?email=${encodeURIComponent(currentUserEmail)}&courseId=${id}`;
      window.location.href = paymentUrl;
    } else {
      toast.error("User email not found. Please log in to access this course.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmitFeedback = async () => {
    try {
      setIsLoading(true);
      if (!currentUserEmail) {
        throw new Error("User email not found. Please log in to provide feedback.");
      }
      await feedbackApi.post('/feedback/add', { ...feedback, courseId: id, userEmail: currentUserEmail });
      toast.success('Feedback added successfully');
      setFeedback({
        rating: 0,
        comment: ""
      });
      fetchFeedbacks();
      setOpenAddFeedbackModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      setIsLoading(true);
      await feedbackApi.delete(`/feedback/${feedbackId}`);
      toast.success('Feedback deleted successfully');
      fetchFeedbacks();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFeedback = async () => {
    try {
      setIsLoading(true);
      await feedbackApi.put(`/feedback/${selectedFeedbackId}`, feedback);
      toast.success('Feedback updated successfully');
      setOpenUpdateModal(false);
      fetchFeedbacks();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenUpdateModal = (feedbackId) => {
    const selectedFeedback = feedbacks.find((item) => item._id === feedbackId);
    if (selectedFeedback) {
      if (selectedFeedback.userEmail === currentUserEmail) {
        setFeedback({
          rating: selectedFeedback.rating,
          comment: selectedFeedback.comment
        });
        setSelectedFeedbackId(feedbackId);
        setOpenUpdateModal(true);
      } else {
        toast.error("You are not authorized to update this feedback.");
      }
    }
  };

  const handleOpenDeleteModal = (feedbackId) => {
    const selectedFeedback = feedbacks.find((item) => item._id === feedbackId);
    if (selectedFeedback) {
      if (selectedFeedback.userEmail === currentUserEmail) {
        setSelectedFeedbackId(feedbackId);
        handleDeleteFeedback(feedbackId);
      } else {
        toast.error("You are not authorized to delete this feedback.");
      }
    }
  };

  const handleCloseUpdateModal = () => {
    setFeedback({
      rating: 0,
      comment: ""
    });
    setSelectedFeedbackId(null);
    setOpenUpdateModal(false);
  };

  const handleOpenAddFeedbackModal = () => {
    if (currentUserEmail) {
      setOpenAddFeedbackModal(true);
    } else {
      toast.error("User email not found. Please log in to provide feedback.");
    }
  };

  const handleCloseAddFeedbackModal = () => {
    setOpenAddFeedbackModal(false);
  };

  // Filter feedbacks based on selected star rating filter
  const filteredFeedbacks = feedbacks.filter((feedbackItem) => {
    if (selectedStarFilters.length === 0) {
      return true; // Show all feedbacks if no star filter is selected
    } else {
      return selectedStarFilters.includes(feedbackItem.rating);
    }
  });

  const handleStarFilterChange = (rating, checked) => {
    if (checked) {
      setSelectedStarFilters((prevFilters) => [...prevFilters, rating]);
    } else {
      setSelectedStarFilters((prevFilters) => prevFilters.filter((filter) => filter !== rating));
    }
    setStarFilter(rating); // Update the starFilter state
  };

  const handleAllStarFilterChange = (checked) => {
    if (checked) {
      setSelectedStarFilters([1, 2, 3, 4, 5]);
      setStarFilter(0); // Update the starFilter state to 0
    } else {
      setSelectedStarFilters([]);
      setStarFilter(0); // Update the starFilter state to 0
    }
  };

  const renderStarRatingFilter = () => {
    const ratings = [1, 2, 3, 4, 5];
    return (
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        {ratings.map((rating) => (
          <Grid item key={rating}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedStarFilters.includes(rating)}
                  onChange={(e) => handleStarFilterChange(rating, e.target.checked)}
                />
              }
              label={
                <>
                  <Rating value={rating} readOnly />
                  <span style={{ marginLeft: 4 }}></span>
                </>
              }
            />
          </Grid>
        ))}
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedStarFilters.length === ratings.length}
                onChange={(e) => handleAllStarFilterChange(e.target.checked)}
              />
            }
            label="Display All"
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Container sx={{ mt: 5 }}>
      {isLoading ? (
        <Typography variant="h5">Loading...</Typography>
      ) : (
        <>
          {courseDetails ? (
            <Grid container spacing={2} sx={{ paddingTop: 10 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="440"
                    image={`${import.meta.env.VITE_COURSE_SERVER_URL}${courseDetails.thumbnail}`}
                    onError={(event) => { event.target.src = "/default-course-image.jpg" }}
                    alt={courseDetails.name}
                  />
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 4 }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" gutterBottom>
                      {courseDetails.name}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      {courseDetails.desc}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" gutterBottom>
                      Price: {courseDetails.price === 0 ? "FREE" : `$${courseDetails.price}`}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Level: {courseDetails.level}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Type: {courseDetails.type}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Duration: {courseDetails.duration}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Average Rating: {averageRating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <Rating value={averageRating} readOnly style={{ marginLeft: 4 }} />
                    </Typography>
                  </CardContent>
                  <Grid container justifyContent="center" mt={2}>
                    <Grid item xs={6}>
                      <Button fullWidth variant="contained" color="primary" onClick={handleGetStarted}>
                        Get started
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item xs={12} sx={{ marginTop: 4 }}>
                <Typography variant="h5" mb={2}>
                  Feedbacks
                </Typography>
                <Box mb={2}>
                  {renderStarRatingFilter()}
                </Box>
                {filteredFeedbacks.map((feedbackItem, index) => (
                  <Card key={index} sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography variant="body1">
                        Rating: <Rating value={feedbackItem.rating} readOnly />
                      </Typography>
                      <Typography variant="body1">
                        Comment: {feedbackItem.comment}
                      </Typography>
                      {currentUserEmail === feedbackItem.userEmail && (
                        <Grid container justifyContent="flex-end" mt={2}>
                          <IconButton color="primary" onClick={() => handleOpenUpdateModal(feedbackItem._id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="secondary" onClick={() => handleOpenDeleteModal(feedbackItem._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Grid>
              <Grid item xs={12} sx={{ marginTop: 4 }}>
                <Typography variant="h5" mb={2}>
                  Add Feedback
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenAddFeedbackModal}
                  disabled={isLoading}
                >
                  Add Feedback
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="h5">Course not found</Typography>
          )}
        </>
      )}
      <Modal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        aria-labelledby="update-feedback-modal"
        aria-describedby="update-feedback-form"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 400
          }}
        >
          <Typography variant="h6" gutterBottom>
            Update Feedback
          </Typography>
          <Rating
            name="rating"
            value={feedback.rating}
            onChange={(event, newValue) => {
              setFeedback(prevState => ({
                ...prevState,
                rating: newValue
              }));
            }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comment"
            name="comment"
            value={feedback.comment}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateFeedback}
            disabled={isLoading}
          >
            Update Feedback
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openAddFeedbackModal}
        onClose={handleCloseAddFeedbackModal}
        aria-labelledby="add-feedback-modal"
        aria-describedby="add-feedback-form"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 400
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add Feedback
          </Typography>
          <Rating
            name="rating"
            value={feedback.rating}
            onChange={(event, newValue) => {
              setFeedback(prevState => ({
                ...prevState,
                rating: newValue
              }));
            }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comment"
            name="comment"
            value={feedback.comment}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitFeedback}
            disabled={isLoading}
          >
            Submit Feedback
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default CourseDetailsPage;
