import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import CreateOrder from './pages/CreateOrder';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

// Enhanced theme with KartFlow branding
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      dark: '#5a67d8',
      light: '#7c87f0',
    },
    secondary: {
      main: '#764ba2',
      dark: '#6b46c1',
      light: '#8b5cf6',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// For development, we'll use simple authentication mock
const MockAuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const login = async (credentials) => {
    setLoading(true);
    // Mock login - in real app, this would call the API
    setTimeout(() => {
      setUser({
        id: 1,
        username: credentials.email.split('@')[0],
        email: credentials.email,
        is_staff: credentials.email.includes('admin'),
      });
      setLoading(false);
    }, 1000);
  };

  const register = async (userData) => {
    setLoading(true);
    // Mock register - in real app, this would call the API
    setTimeout(() => {
      setUser({
        id: 1,
        username: userData.username,
        email: userData.email,
        is_staff: false,
      });
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin: user?.is_staff || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  return (
    <AuthContext.Consumer>
      {({ user, loading }) => {
        if (loading) {
          return <div>Loading...</div>;
        }
        
        if (!user) {
          return <Navigate to="/login" replace />;
        }
        
        if (requiredRole === 'admin' && !user.is_staff) {
          return <Navigate to="/dashboard" replace />;
        }
        
        return children;
      }}
    </AuthContext.Consumer>
  );
};

// Public Route Component
const PublicRoute = ({ children }) => {
  return (
    <AuthContext.Consumer>
      {({ user, loading }) => {
        if (loading) {
          return <div>Loading...</div>;
        }
        
        if (user) {
          return <Navigate to="/dashboard" replace />;
        }
        
        return children;
      }}
    </AuthContext.Consumer>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MockAuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Dashboard />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Dashboard />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Products />
                  </>
                </ProtectedRoute>
              } />
              <Route path="/create-order" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <CreateOrder />
                  </>
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <>
                    <Navbar />
                    <AdminDashboard />
                  </>
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            
            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastStyle={{
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>
        </Router>
      </MockAuthProvider>
    </ThemeProvider>
  );
}

export default App;
