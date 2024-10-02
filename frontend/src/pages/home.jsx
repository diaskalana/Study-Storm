import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import Hero from "../components/home/hero";
import CourseCard from "../components/home/courseCard";
import { courseApi } from "../utils/api";
import { toast } from "react-toastify";

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const page = 1; 
        const rows = 50; 
        const { data } = await courseApi.get("/course/all", { params: { page, rows } });
        // Remove filtering of unpublished courses
        setCourses(data.payload.rows);
        setFilteredCourses(data.payload.rows);
      } catch (error) {
        // toast.error(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = courses.filter((course) => {
      return (
        course.name.toLowerCase().includes(searchTerm) ||
        course.price.toString().includes(searchTerm) ||
        (searchTerm === "free" && course.price === 0)
      );
    });
    setFilteredCourses(filtered);
  };

  return (
    <Container sx={{ mt: 8 }}>
      <Hero />
      <Typography variant="h4" sx={{ mb: 2 }}>
        Popular Courses
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Search Courses"
        placeholder="Search by name or price (e.g., enter 'free' for free courses)"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 5,mt: 2}}
      />
      <Grid container spacing={2}>
        {isLoading ? (
          <Typography variant="h5">Loading...</Typography>
        ) : filteredCourses.length === 0 ? (
          <Typography variant="h5">No courses found</Typography>
        ) : (
          filteredCourses.map((course) => (
            <Grid key={course.id} item xs={12} sm={6} md={4}>
              <CourseCard course={course} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default HomePage;
