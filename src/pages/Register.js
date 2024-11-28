import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Link, Alert } from '@mui/material';
import axios from 'axios'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(null); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      
      await axios.post('http://localhost:5000/api/register', { username, email, password });
      setSuccess('Registration successful! You can now log in.');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
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
          maxWidth: 400,
          padding: 4,
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            marginBottom: 3,
            color: '#333',
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        >
          Create Account
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: 3, color: '#666' }}>
          Fill in the details to register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleRegister}>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          <TextField
            type="password"
            label="Password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          <TextField
            type="password"
            label="Confirm Password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />

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
            }}
          >
            Register
          </Button>
        </form>

        <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
          <Grid item>
            <Typography variant="body2" sx={{ color: '#666' }}>
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
