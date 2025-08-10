import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Avatar,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  Inventory,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  Edit,
  Delete,
  Add,
  Visibility,
  AdminPanelSettings,
  Notifications,
  Settings,
  Analytics,
  Security,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-toastify';

// Sample data for admin dashboard
const dashboardStats = [
  { title: 'Total Users', value: '1,247', icon: <People />, color: '#3f51b5', change: '+12%' },
  { title: 'Total Products', value: '324', icon: <Inventory />, color: '#4caf50', change: '+8%' },
  { title: 'Total Orders', value: '2,156', icon: <ShoppingCart />, color: '#ff9800', change: '+15%' },
  { title: 'Revenue', value: '$48,265', icon: <AttachMoney />, color: '#f44336', change: '+23%' },
];

const salesData = [
  { month: 'Jan', sales: 4000, orders: 240 },
  { month: 'Feb', sales: 3000, orders: 198 },
  { month: 'Mar', sales: 5000, orders: 312 },
  { month: 'Apr', sales: 7000, orders: 445 },
  { month: 'May', sales: 6000, orders: 378 },
  { month: 'Jun', sales: 8000, orders: 512 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#3f51b5' },
  { name: 'Clothing', value: 25, color: '#4caf50' },
  { name: 'Books', value: 20, color: '#ff9800' },
  { name: 'Home & Garden', value: 20, color: '#f44336' },
];

const recentUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active', avatar: null },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Customer', status: 'Active', avatar: null },
  { id: 3, name: 'Admin User', email: 'admin@kartflow.com', role: 'Admin', status: 'Active', avatar: null },
  { id: 4, name: 'Test User', email: 'test@example.com', role: 'Customer', status: 'Inactive', avatar: null },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: '$299.99', status: 'Delivered', date: '2025-01-10' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: '$149.99', status: 'Shipped', date: '2025-01-09' },
  { id: 'ORD-003', customer: 'Bob Johnson', amount: '$79.99', status: 'Processing', date: '2025-01-08' },
  { id: 'ORD-004', customer: 'Alice Wilson', amount: '$199.99', status: 'Pending', date: '2025-01-08' },
];

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const StatCard = ({ stat }) => (
    <Card elevation={6} sx={{ 
      height: '100%',
      borderRadius: 3,
      background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
      },
      transition: 'all 0.3s ease'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color={stat.color}>
              {stat.value}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {stat.title}
            </Typography>
            <Chip 
              label={stat.change} 
              size="small" 
              color="success" 
              sx={{ mt: 1 }}
            />
          </Box>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {stat.icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const OverviewTab = () => (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard stat={stat} />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card elevation={6} sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
              Sales & Orders Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="sales" fill="#3f51b5" />
                <Bar dataKey="orders" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={6} sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <Analytics sx={{ mr: 1, verticalAlign: 'middle' }} />
              Category Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={6} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Orders
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            size="small"
                            color={getStatusColor(order.status)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={6} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <People sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Users
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                              {user.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            size="small"
                            color={user.role === 'Admin' ? 'primary' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.status}
                            size="small"
                            color={getStatusColor(user.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => { setSelectedUser(user); setUserDialogOpen(true); }}>
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const UsersTab = () => (
    <Card elevation={6} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            <People sx={{ mr: 1, verticalAlign: 'middle' }} />
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ borderRadius: 2 }}
          >
            Add User
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body1" fontWeight="bold">
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      color={user.role === 'Admin' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      color={getStatusColor(user.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => { setSelectedUser(user); setUserDialogOpen(true); }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const SettingsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card elevation={6} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
              General Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField label="Site Name" defaultValue="KartFlow" fullWidth />
              <TextField label="Site Description" defaultValue="Professional E-commerce Platform" fullWidth />
              <TextField label="Contact Email" defaultValue="admin@kartflow.com" fullWidth />
              <Button variant="contained" sx={{ alignSelf: 'flex-start', borderRadius: 2 }}>
                Save Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card elevation={6} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
              Security Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Alert severity="info">
                Two-factor authentication is recommended for admin accounts.
              </Alert>
              <Button variant="outlined" sx={{ alignSelf: 'flex-start', borderRadius: 2 }}>
                Enable 2FA
              </Button>
              <Button variant="outlined" color="warning" sx={{ alignSelf: 'flex-start', borderRadius: 2 }}>
                Change Password
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4,
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper elevation={8} sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AdminPanelSettings sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
                  Admin Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  KartFlow Management Center
                </Typography>
              </Box>
            </Box>
            <Badge badgeContent={5} color="error">
              <Notifications sx={{ fontSize: 32, color: 'action.active' }} />
            </Badge>
          </Box>
        </Paper>

        {/* Tabs */}
        <Paper elevation={6} sx={{ borderRadius: 3, mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
              },
            }}
          >
            <Tab icon={<DashboardIcon />} label="Overview" />
            <Tab icon={<People />} label="Users" />
            <Tab icon={<Settings />} label="Settings" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box>
          {currentTab === 0 && <OverviewTab />}
          {currentTab === 1 && <UsersTab />}
          {currentTab === 2 && <SettingsTab />}
        </Box>

        {/* User Edit Dialog */}
        <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField label="Name" defaultValue={selectedUser.name} fullWidth />
                <TextField label="Email" defaultValue={selectedUser.email} fullWidth />
                <TextField label="Role" defaultValue={selectedUser.role} fullWidth />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setUserDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
