import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../utils/api";
import { useDispatch } from "react-redux";
import { clearUserInfo } from "../../../slices/authSlice";

export default function AccountDetailsForm() {
  const [user, setUser] = useState({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changesMade, setChangesMade] = useState(false);
  const [passfiledsChanged, setPassfiledsChanged] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from local storage once when component mounts
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userData);
  }, []);

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [payload, setPayload] = useState({});

  const dispatch = useDispatch();

const profilePayload = {

  firstName: firstName === "" ? user.firstName : firstName,
  lastName: lastName === "" ? user.lastName : lastName,
  email: email === "" ? user.email : email,
  phoneNumber: phone === "" ? user.phoneNumber : phone,
};

const passwordPayload = {
  currentPassword,
  newPassword,
  confirmPassword,
};






  const handleInputChange = () => {
    // Set changesMade to true when any field changes
    setChangesMade(true);
  };

  const handlePasswordChange = () => {
    // Set passfiledsChanged to true when any password field changes
    setPassfiledsChanged(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUrl("");

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setPhone(user.phoneNumber);
    setCurrentPassword("");
    setNewPassword(""); 
    setConfirmPassword("");

    setChangesMade(false);
    setPassfiledsChanged(false);

    setPayload({});
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    handleClickOpen();
    setUrl(`user/${user.email}`);
    setPayload(profilePayload);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    handleClickOpen();
    setUrl(`user/userProfile/updatePassword/${user.email}`);
    setPayload(passwordPayload);
  };

  const handleDialogSubmit = async(url,payload) => {
    handleClose();

    // Make a PUT request to the server with the updated user data
    try {
      const response = await authApi.patch(`/v1/${url}`, payload)
      console.log(response);
      if(response) {
        toast.success("Profile updated successfully!");
      }
    // logout user
    dispatch(clearUserInfo());
    navigate("/login");

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);

    }



  };

  return (
    <>
      <Card>
        <CardHeader title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>First name</InputLabel>
                <OutlinedInput
                  value={firstName === "" ? user.firstName : firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    handleInputChange();
                  }}
                  label="First name"
                  name="firstName"
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput
                  value={lastName === "" ? user.lastName : lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    handleInputChange();
                  }}
                  label="Last name"
                  name="lastName"
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput
                  value={email === "" ? user.email : email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleInputChange();
                  }}
                  label="Email address"
                  name="email"
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput
                  label="Phone number"
                  name="phone"
                  type="tel"
                  value={phone === "" ? user.phoneNumber : phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    handleInputChange();
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            type="submit"
            onClick={handleProfileSubmit}
            disabled={!changesMade}
          >
            Save Profile
          </Button>
        </CardActions>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardHeader title="Change Password" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Current password</InputLabel>
                <OutlinedInput
                  label="Current password"
                  name="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    handlePasswordChange();
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>New password</InputLabel>
                <OutlinedInput
                  label="New password"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    handlePasswordChange();
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Confirm New password</InputLabel>
                <OutlinedInput
                  label="Confirm password"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    handlePasswordChange();
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            type="submit"
            onClick={handlePasswordSubmit}
            disabled={!passfiledsChanged}
          >
            Save Password
          </Button>
        </CardActions>
      </Card>

      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure ?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            After changing the details, you will have to login again.
          </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={() => handleDialogSubmit(url,payload)} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
}
