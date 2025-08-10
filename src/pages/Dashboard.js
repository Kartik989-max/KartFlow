import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Inventory,
  TrendingUp,
  Warning,
  Dashboard as DashboardIcon,
  Store,
  People,
  AttachMoney,
  Timeline,
  Add,
  Visibility,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { orderService, inventoryService } from '../services/ecommerceApi';

const StatCard = ({ title, value, icon, color = '#667eea', change = null, onClick = null }) => (
  <Card 
    elevation={8} 
    sx={{ 
      height: '100%',
      borderRadius: 3,
      background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': {
        transform: onClick ? 'translateY(-4px)' : 'none',
        boxShadow: onClick ? '0 12px 30px rgba(0,0,0,0.15)' : '0 8px 25px rgba(0,0,0,0.1)'
      },
      transition: 'all 0.3s ease'
    }}
    onClick={onClick}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h3" component="div" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
            {value}
          </Typography>
          {change && (
            <Chip 
              label={change} 
              size="small" 
              color="success" 
              variant="filled"
              sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}
            />
          )}
        </Box>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: `0 8px 25px ${color}40`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Sample data for charts
const salesData = [
  { month: 'Jan', sales: 4000, orders: 240 },
  { month: 'Feb', sales: 3000, orders: 198 },
  { month: 'Mar', sales: 5000, orders: 312 },
  { month: 'Apr', sales: 7000, orders: 445 },
  { month: 'May', sales: 6000, orders: 378 },
  { month: 'Jun', sales: 8000, orders: 512 },
];

const pieData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Books', value: 20 },
  { name: 'Home & Garden', value: 20 },
];

const COLORS = ['#667eea', '#4CAF50', '#FF9800', '#f44336'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);
  const [stats, setStats] = useState({
    orders: null,
    inventory: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // For demo purposes, we'll use mock data since the API might not be connected
      setStats({
        orders: { total_orders: 24, total_spent: 48265 },
        inventory: { total_items: 8, low_stock_items: 2 },
      });
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6">Loading dashboard...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4,
    }}>
      <Container maxWidth="xl">
        {/* Welcome Header */}
        <Paper elevation={8} sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                width: 64, 
                height: 64, 
                mr: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  Welcome back, {user?.username || 'User'}! 👋
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {isAdmin ? 'Administrator' : 'Customer'} • KartFlow Dashboard
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/create-order')}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #45a049, #3d8b40)',
                  }
                }}
              >
                New Order
              </Button>
              <Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={() => navigate('/products')}
                sx={{ borderRadius: 2, px: 3 }}
              >
                View Products
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value={stats.orders?.total_orders || '24'}
              icon={<ShoppingCart sx={{ fontSize: 28 }} />}
              color="#667eea"
              change="+12%"
              onClick={() => navigate('/orders')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={`$${stats.orders?.total_spent?.toFixed(2) || '48,265'}`}
              icon={<AttachMoney sx={{ fontSize: 28 }} />}
              color="#4CAF50"
              change="+23%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Products"
              value={stats.inventory?.total_items || '8'}
              icon={<Inventory sx={{ fontSize: 28 }} />}
              color="#FF9800"
              change="+8%"
              onClick={() => navigate('/products')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Customers"
              value="156"
              icon={<People sx={{ fontSize: 28 }} />}
              color="#9C27B0"
              change="+15%"
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card elevation={8} sx={{ borderRadius: 3, p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                Sales Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#667eea" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={8} sx={{ borderRadius: 3, p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <Store sx={{ mr: 1, verticalAlign: 'middle' }} />
                Category Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper elevation={8} sx={{ p: 4, borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
            <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Add />}
                onClick={() => navigate('/create-order')}
                sx={{ py: 2, borderRadius: 2, textTransform: 'none' }}
              >
                Create New Order
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Inventory />}
                onClick={() => navigate('/products')}
                sx={{ py: 2, borderRadius: 2, textTransform: 'none' }}
              >
                Manage Products
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<ShoppingCart />}
                sx={{ py: 2, borderRadius: 2, textTransform: 'none' }}
              >
                View Orders
              </Button>
            </Grid>
            {isAdmin && (
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<DashboardIcon />}
                  onClick={() => navigate('/admin')}
                  sx={{ 
                    py: 2, 
                    borderRadius: 2, 
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                    }
                  }}
                >
                  Admin Panel
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
