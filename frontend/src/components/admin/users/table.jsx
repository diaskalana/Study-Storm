import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { authApi } from '../../../utils/api';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function createData(id, firstName, lastName, email, phoneNumber, roles) {
  return { id, firstName, lastName, email, phoneNumber, roles };
}

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token)
        const response = await authApi.get('v1/users/all')
        console.log('Users:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      const response = await authApi.delete(`v1/user/${id}`);
      console.log('User deleted:');
      toast.success('User deleted successfully');
      setOpen(false);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead>
            <TableRow > 
              <TableCell>ID</TableCell>
              <TableCell align="right">First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Phone Number</TableCell>
              <TableCell align="right">Roles</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell align="right">{user.firstName}</TableCell>
                <TableCell align="right">{user.lastName}</TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="right">{user.phoneNumber}</TableCell>
                <TableCell align="right">{user.roles}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="error" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDeleteConfirmed(deleteId)} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
