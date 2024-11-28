import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Grid, Link, Alert } from '@mui/material';
import axios from 'axios'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      const { role, token } = response.data;

      
      localStorage.setItem('authToken', token);

     
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'user') {
        navigate('/user/dashboard');
      } else {
        setError('Invalid role. Please contact support.');
      }
    } catch (err) {
      
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          variant="h5"
          sx={{
            marginBottom: 3,
            color: '#333',
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        >
          SK Event Feedbacking System
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: 3, color: '#666' }}>
          Please login to continue
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
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
            Login
          </Button>
        </form>

        <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
          <Grid item>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Don't have an account?{' '}
              <Link
                href="/register"
                sx={{
                  textDecoration: 'none',
                  color: '#004e92',
                  fontWeight: 'bold',
                }}
              >
                Register
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;
