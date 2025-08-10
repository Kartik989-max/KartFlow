import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  Store,
  Add,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: <Dashboard /> },
    { label: 'Products', path: '/products', icon: <Store /> },
    { label: 'Orders', path: '/orders', icon: <ShoppingCart /> },
    { label: 'Inventory', path: '/inventory', icon: <Inventory /> },
  ];

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
        >
          E-Commerce Kafka System
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
          
          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => navigate('/create-order')}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            New Order
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
