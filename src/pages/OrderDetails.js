import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  LocationOn,
  Schedule,
  Receipt,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
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

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const orderData = await orderService.getOrder(id);
      setOrder(orderData);
    } catch (err) {
      setError('Failed to fetch order details');
      console.error('Order details fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateItemTotal = (item) => {
    return item.quantity * item.unit_price;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error || 'Order not found'}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
          sx={{ mr: 2 }}
        >
          Back to Orders
        </Button>
        <Typography variant="h4" component="h1">
          Order Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                Order #{order.id.slice(0, 8)}...
              </Typography>
              <Chip
                label={order.status}
                color={getStatusColor(order.status)}
                size="large"
              />
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Customer
                    </Typography>
                    <Typography variant="body1">
                      {order.user}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Order Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(order.created_at)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <LocationOn sx={{ mr: 1, color: 'text.secondary', mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Shipping Address
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {order.shipping_address}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Order Items */}
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography variant="subtitle1">
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          SKU: {item.product.sku}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" fontWeight="bold">
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1">
                          ${item.unit_price}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight="bold">
                          ${calculateItemTotal(item).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Order Summary
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Items ({order.items.length})
                  </Typography>
                  <Typography variant="body2">
                    ${order.total_amount}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Shipping
                  </Typography>
                  <Typography variant="body2">
                    Free
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Tax
                  </Typography>
                  <Typography variant="body2">
                    $0.00
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">
                    Total
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${order.total_amount}
                  </Typography>
                </Box>
              </Box>

              {/* Order Timeline */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Order Timeline
              </Typography>
              <Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Order Created
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(order.created_at)}
                  </Typography>
                </Box>
                {order.updated_at !== order.created_at && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Last Updated
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(order.updated_at)}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Current Status
                  </Typography>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetails;
