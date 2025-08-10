import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ShoppingCart,
  Dashboard,
  Inventory,
  Person,
  AdminPanelSettings,
  Logout,
  Login,
  PersonAdd,
  Store,
  Notifications,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/login');
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const navButtons = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Products', path: '/products', icon: <Inventory /> },
    { label: 'Create Order', path: '/create-order', icon: <ShoppingCart /> },
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={8}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        {/* Logo and Brand */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            mr: 4
          }}
          onClick={() => navigate('/dashboard')}
        >
          <Store sx={{ fontSize: 32, mr: 1, color: '#fff' }} />
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #fff, #e3f2fd)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            KartFlow
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 4 }}>
          {navButtons.map((button) => (
            <Button
              key={button.path}
              startIcon={button.icon}
              onClick={() => navigate(button.path)}
              sx={{
                color: 'white',
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: isActivePage(button.path) ? 'bold' : 'normal',
                backgroundColor: isActivePage(button.path) 
                  ? 'rgba(255,255,255,0.2)' 
                  : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {button.label}
            </Button>
          ))}
          
          {/* Admin Panel Button */}
          {isAdmin && (
            <Button
              startIcon={<AdminPanelSettings />}
              onClick={() => navigate('/admin')}
              sx={{
                color: 'white',
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: isActivePage('/admin') ? 'bold' : 'normal',
                backgroundColor: isActivePage('/admin') 
                  ? 'rgba(255,193,7,0.3)' 
                  : 'transparent',
                border: '1px solid rgba(255,193,7,0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(255,193,7,0.2)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Admin Panel
            </Button>
          )}
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton sx={{ mr: 2, color: 'white' }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Menu */}
        {user ? (
          <>
            <Tooltip title="Account Menu">
              <IconButton onClick={handleMenuOpen} sx={{ color: 'white' }}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    width: 40,
                    height: 40,
                  }}
                >
                  {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 8,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 200,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.username || user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.is_staff ? 'Administrator' : 'Customer'}
                </Typography>
              </Box>
              
              <Divider />
              
              <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              
              <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<Login />}
              onClick={() => navigate('/login')}
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                textTransform: 'none',
                px: 3,
                borderRadius: 2,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Login
            </Button>
            <Button
              startIcon={<PersonAdd />}
              onClick={() => navigate('/register')}
              variant="contained"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                textTransform: 'none',
                px: 3,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
