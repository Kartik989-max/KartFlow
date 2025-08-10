import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Visibility, Edit, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/ecommerceApi';

const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    confirmed: 'info',
    processing: 'primary',
    shipped: 'secondary',
    delivered: 'success',
    cancelled: 'error',
  };
  return colors[status] || 'default';
};

const StatusUpdateDialog = ({ open, onClose, order, onUpdate }) => {
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (order) {
      setNewStatus(order.status);
    }
  }, [order]);

  const handleUpdate = () => {
    if (newStatus && newStatus !== order.status) {
      onUpdate(order.id, newStatus);
    }
    onClose();
  };

  const getValidStatuses = (currentStatus) => {
    const transitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };
    return transitions[currentStatus] || [];
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Order Status</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value={order?.status}>
              {order?.status} (Current)
            </MenuItem>
            {getValidStatuses(order?.status).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleUpdate} 
          variant="contained"
          disabled={!newStatus || newStatus === order?.status}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDialog, setStatusDialog] = useState({ open: false, order: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data.results || data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully!');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update order status');
      console.error('Status update error:', err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(orderId);
        toast.success('Order cancelled successfully!');
        fetchOrders();
      } catch (err) {
        toast.error('Failed to cancel order');
        console.error('Cancel order error:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Orders
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/create-order')}
        >
          Create New Order
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {order.id.slice(0, 8)}...
                  </Typography>
                </TableCell>
                <TableCell>{order.user}</TableCell>
                <TableCell>
                  <Typography variant="h6" color="primary">
                    ${order.total_amount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View
                    </Button>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => setStatusDialog({ open: true, order })}
                        >
                          Update
                        </Button>
                        {(order.status === 'pending' || order.status === 'confirmed') && (
                          <Button
                            size="small"
                            startIcon={<Cancel />}
                            color="error"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {orders.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No orders found
          </Typography>
        </Box>
      )}

      <StatusUpdateDialog
        open={statusDialog.open}
        onClose={() => setStatusDialog({ open: false, order: null })}
        order={statusDialog.order}
        onUpdate={handleUpdateStatus}
      />
    </Container>
  );
};

export default Orders;
