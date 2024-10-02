import { useState } from "react";
import axios from "axios";
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
import { createTheme, ThemeProvider } from "@mui/material/styles";
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

export default function SendOtp({ email, setEmail, setSendOtpState, setVerifyOtpState}) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a request to your backend API to handle forgot password
      const response = await authApi.post(`/forgotPassword/verifyMail/${email}`);
      console.log("Password reset email sent!", response.data);
      toast.success("Password reset email sent! Check your inbox.");
      setSuccess(true);
      setError(false);
      setSendOtpState(false);
      setVerifyOtpState(true);

    } catch (error) {
      console.error("Forgot password request failed!", error);
      toast.error(" Failed to send password reset OTP! Please try again.");
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
          alignItems: "center",
          marginTop: "100px",
        }}
      >
        <CssBaseline />
        {/* {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
           Something went wrong! Please try again.
          </Alert>
        )}
        {success && (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            Password reset email sent! Check your inbox.
          </Alert>
        )} */}
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#1976d2", color: "#fff" }}
            >
              Send OTP
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Back to Sign In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
