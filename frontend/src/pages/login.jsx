import { useState } from "react";
import axios from "axios";
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
import { Alert, AlertTitle, Card } from "@mui/material";
import { Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../slices/authSlice";
import { authApi } from "../utils/api";
import { toast } from "react-toastify";


const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Adjust primary color
    },
  },
});

export default function LoginPage() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const requestData = {
      username: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await authApi.post(`/v1/login`, requestData)
       
      // Handle successful login response, e.g., redirect or store token
      console.log("Login successful!", response.data);
      const token = response.data.accessToken;
      localStorage.setItem("token", token);

      setError(false);
      setSuccess(true);

      // Fetch user information using the token

      const userResponse = await authApi.get(`/v1/user`, {
        headers: {
          Authorization: token,
        },
      });

      console.log("User information", userResponse.data);

      // Extract user information from the response
      const { firstName, lastName, email, phoneNumber, roles } =
        userResponse.data;

      // Dispatch setUserInfo action with user information
      dispatch(
        setUserInfo({
          firstName,
          lastName,
          displayName: `${firstName} ${lastName}`,
          email,
          phoneNumber,
          userType: roles,
        })
      );

      toast.success("Login successful!");
      // Redirect to home page
      navigate("/");
    } catch (error) {
      // Handle error response, e.g., display error message
      console.log("Login failed!", error);
      if (error.name === "AxiosError") {
        toast.error("Incorrect email or password");
      }else{
        toast.error(error.response?.data?.message || error.message);
      }
      setSuccess(false);
      setError(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
        }}
      >
        <CssBaseline />
        {/* {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Incorrect email or password
          </Alert>
        )}
        {success && (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            Login successful!
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
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
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
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>

                {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "#1976d2", color: "#fff" }}
              >
                Sign In
              </Button>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Link href="/register" variant="body2">
                    Don't have an account? Sign up
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/forgotpassword" variant="body2">
                    Forgot Password?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Card>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
