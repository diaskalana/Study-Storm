import { useState } from "react";
import axios from "axios";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, AlertTitle } from "@mui/material";
import { authApi } from "../../utils/api";
import { toast } from "react-toastify";


const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

export default function ChangePassword({ email, setChangePasswordState }) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Make an API call to change password
      const response = await authApi.post(`/forgotPassword/changePassword/${email}`,passwords)

      console.log("Password change successful!", response.data);

      // Reset state
      setError(false);
      setSuccess(true);
      setPasswords({
        password: "",
        confirmPassword: "",
      });

      setChangePasswordState(false);
      toast.success("Password change successful! Please login with your new password.");
      navigate("/login");
    } catch (error) {
      console.error("Password change failed!", error);
      toast.error(error.response?.data?.message || error.message);
      setError(true);
      setSuccess(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPasswords({ ...passwords, [name]: value });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "100px",
        }}
      >
        <CssBaseline />
        {/* {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            Password change failed. Please try again.
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle>Success</AlertTitle>
            Password change successful!
          </Alert>
        )} */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            Change Password
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="newPassword"
              label="New Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={passwords.password}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={passwords.confirmPassword}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "#1976d2", color: "#fff" }}
            >
              Change Password
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/forgotpassword"
                  variant="body2"
                >
                  Forgot Password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
