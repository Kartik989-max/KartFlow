import React, { useState, useContext } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Store,
  AdminPanelSettings,
  Person,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials
  const demoCredentials = {
    user: { email: 'demo@kartflow.com', password: 'demo123' },
    admin: { email: 'admin@kartflow.com', password: 'admin123' }
  };

  const fillDemoCredentials = (type) => {
    setFormData(demoCredentials[type]);
    setLoginType(type);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4,
    }}>
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Store sx={{ fontSize: 48, color: 'white', mr: 2 }} />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              KartFlow
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            Professional E-commerce Management System
          </Typography>
        </Box>

        {/* Login Form */}
        <Paper elevation={12} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your KartFlow account
            </Typography>
          </Box>

          {/* Demo Credentials */}
          <Card elevation={2} sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Quick Demo Access:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Person />}
                  onClick={() => fillDemoCredentials('user')}
                  sx={{ textTransform: 'none' }}
                >
                  Demo User
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AdminPanelSettings />}
                  onClick={() => fillDemoCredentials('admin')}
                  sx={{ textTransform: 'none' }}
                >
                  Demo Admin
                </Button>
              </Box>
            </CardContent>
          </Card>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 2,
                mb: 3,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                sx={{
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  color: 'primary.main',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Create Account
              </Link>
            </Typography>
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            © 2025 KartFlow. Professional E-commerce Solution.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
