import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Grid, Link, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    extensionName: '',
    birthday: '',
    purok: '',
    civilStatus: '',
    educationBackgroundId: '',
    userName: '',
    userType: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const {
      password,
      confirmPassword,
      userName,
      firstName,
      middleName,
      lastName,
      extensionName,
      birthday,
      purok,
      civilStatus,
      educationBackgroundId,
      userType
    } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/user/createAccount', {
        userName,
        firstName,
        middleName,
        lastName,
        extensionName,
        birthday,
        purok,
        civilStatus,
        educationBackgroundId,
        userType,
        password
      });
      
      setSuccess('Registration successful! You can now log in.');
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        extensionName: '',
        birthday: '',
        purok: '',
        civilStatus: '',
        educationBackgroundId: '',
        userName: '',
        userType: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  console.log(formData);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 5,
        background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
        color: '#fff',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 500,  
          padding: 3,  
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography
          variant="h6"  
          sx={{
            marginBottom: 2,
            color: '#333',
            fontWeight: 'bold',
            letterSpacing: 1,
            fontSize: '1 rem' 
          }}
        >
          Create Account
        </Typography>

        <Typography variant="body2" sx={{ marginBottom: 3, color: '#666', fontSize: '0.875rem' }}>
          Fill in the details to register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2, fontSize: '0.875rem' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ marginBottom: 2, fontSize: '0.875rem' }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleRegister}>
          <Grid container spacing={1} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                sx={{ fontSize: '0.875rem' }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                sx={{ fontSize: '0.875rem' }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Middle Name"
                fullWidth
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                sx={{ fontSize: '0.875rem' }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Extension Name (optional)"
                fullWidth
                name="extensionName"
                value={formData.extensionName}
                onChange={handleChange}
                sx={{ fontSize: '0.875rem' }} 
              />
            </Grid>
          </Grid>

          <Grid container spacing={1} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Birthday"
                fullWidth
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ fontSize: '0.875rem' }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Purok"
                fullWidth
                name="purok"
                value={formData.purok}
                onChange={handleChange}
                sx={{ fontSize: '0.875rem' }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Civil Status"
                fullWidth
                name="civilStatus"
                value={formData.civilStatus}
                onChange={handleChange}
                sx={{ fontSize: '0.875rem' }} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Education Background ID"
                fullWidth
                name="educationBackgroundId"
                value={formData.educationBackgroundId}
                onChange={handleChange}
                sx={{ fontSize: '0.875rem' }} 
              />
            </Grid>
          </Grid>

          <Grid container spacing={1} sx={{ marginBottom: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="UserName"
                fullWidth
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                sx={{ fontSize: '0.875rem' }} 
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: '0.875rem' }}>User Type</InputLabel>
                <Select
                  label="User Type"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  sx={{ fontSize: '0.875rem' }} 
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                label="Password"
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleChange}
                sx={{ fontSize: '0.875rem' }} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                label="Confirm Password"
                fullWidth
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{ fontSize: '0.875rem' }} 
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              paddingY: 1.5,
              fontWeight: 'bold',
              letterSpacing: 1,
              backgroundColor: '#004e92',
              '&:hover': {
                backgroundColor: '#003d75',
              },
              borderRadius: '8px',
              fontSize: '0.875rem' 
            }}
          >
            Register
          </Button>
        </form>

        <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
          <Grid item>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem' }}>
              Already have an account?{' '}
              <Link
                href="/login"
                sx={{
                  textDecoration: 'none',
                  color: '#004e92',
                  fontWeight: 'bold',
                }}
              >
                Login
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Register;
