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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { 
  Edit, 
  Warning, 
  TrendingUp, 
  TrendingDown,
  Inventory2 
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { inventoryService } from '../services/ecommerceApi';

const getStockStatusColor = (item) => {
  if (item.current_stock === 0) return 'error';
  if (item.is_low_stock) return 'warning';
  return 'success';
};

const StockUpdateDialog = ({ open, onClose, item, onUpdate }) => {
  const [formData, setFormData] = useState({
    quantity: '',
    movement_type: 'adjustment',
    notes: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        quantity: '',
        movement_type: 'adjustment',
        notes: '',
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.quantity && item) {
      onUpdate(item.id, formData);
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Update Stock - {item?.product_name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Current Stock: {item?.current_stock} | 
                Reserved: {item?.reserved_stock} | 
                Available: {item?.available_stock}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Movement Type</InputLabel>
                <Select
                  name="movement_type"
                  value={formData.movement_type}
                  onChange={handleChange}
                  label="Movement Type"
                >
                  <MenuItem value="in">Stock In</MenuItem>
                  <MenuItem value="out">Stock Out</MenuItem>
                  <MenuItem value="adjustment">Adjustment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional notes about this stock movement..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Update Stock
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockDialog, setStockDialog] = useState({ open: false, item: null });

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const [itemsData, statsData] = await Promise.all([
        inventoryService.getInventoryItems(),
        inventoryService.getInventoryStats(),
      ]);
      
      setInventoryItems(itemsData.results || itemsData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to fetch inventory data');
      console.error('Inventory fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (itemId, stockData) => {
    try {
      await inventoryService.updateStock(itemId, stockData);
      toast.success('Stock updated successfully!');
      fetchInventoryData();
    } catch (err) {
      toast.error('Failed to update stock');
      console.error('Stock update error:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
      <Typography variant="h4" component="h1" gutterBottom>
        Inventory Management
      </Typography>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Items
                    </Typography>
                    <Typography variant="h4">
                      {stats.total_items}
                    </Typography>
                  </Box>
                  <Inventory2 color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Low Stock
                    </Typography>
                    <Typography variant="h4" color="warning.main">
                      {stats.low_stock_items}
                    </Typography>
                  </Box>
                  <Warning color="warning" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Out of Stock
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {stats.out_of_stock_items}
                    </Typography>
                  </Box>
                  <TrendingDown color="error" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Value
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      ${stats.total_stock_value?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                  <TrendingUp color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="center">Current Stock</TableCell>
              <TableCell align="center">Reserved</TableCell>
              <TableCell align="center">Available</TableCell>
              <TableCell align="center">Min Stock</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryItems.map((item) => (
              <TableRow 
                key={item.id} 
                hover
                sx={{
                  backgroundColor: item.current_stock === 0 ? 'error.light' : 
                                 item.is_low_stock ? 'warning.light' : 'inherit',
                  opacity: item.current_stock === 0 ? 0.7 : 1,
                }}
              >
                <TableCell>
                  <Typography variant="subtitle2">
                    {item.product_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {item.sku}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" color="primary">
                    {item.current_stock}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography color="warning.main">
                    {item.reserved_stock}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography color="success.main" fontWeight="bold">
                    {item.available_stock}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {item.minimum_stock}
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      item.current_stock === 0 ? 'Out of Stock' :
                      item.is_low_stock ? 'Low Stock' : 'In Stock'
                    }
                    color={getStockStatusColor(item)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(item.updated_at)}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => setStockDialog({ open: true, item })}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {inventoryItems.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No inventory items found
          </Typography>
        </Box>
      )}

      <StockUpdateDialog
        open={stockDialog.open}
        onClose={() => setStockDialog({ open: false, item: null })}
        item={stockDialog.item}
        onUpdate={handleUpdateStock}
      />
    </Container>
  );
};

export default Inventory;
