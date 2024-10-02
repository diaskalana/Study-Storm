import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Alert,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../utils/api";
import { toast } from "react-toastify";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Adjust primary color
    },
  },
});

export default function AdminRegisterPage() {
  const [responseData, setResponseData] = useState("");
  const [role, setRole] = useState("ROLE_LEARNER");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const requestData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      phoneNumber: data.get("phone"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
      roles: role,
    };

    console.log(requestData);
    try {
      const response = await authApi.post(`v1/new`, requestData);

      console.log(response);
      setResponseData(response.data);

      if (response.data === "User added successfully") {
        toast.success("User added successfully");
        navigate("/admin/users/all");
        return;
      }

      toast.error(response.data);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);

      // handle error here
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          justifyContent: "center",
        }}
      >
        <CssBaseline />
        {/* {responseData && (
          <Alert
            severity={
              responseData === "User added successfully" ? "success" : "error"
            }
            sx={{ marginBottom: 2 }}
          >
            {responseData}
          </Alert>
        )} */}
        <Card sx={{}}>
          <Box
            sx={{
              marginTop: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
              Register User
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="phone"
                    label="Phone Number"
                    name="phone"
                    autoComplete="tel"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="comfirmPassword"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Age"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                      <MenuItem value="ROLE_LEARNER">Learner </MenuItem>
                      <MenuItem value="ROLE_INSTRUCTOR">Instructor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "#1976d2", color: "#fff" }}
              >
                Add User
              </Button>
            </Box>
          </Box>
        </Card>

        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
