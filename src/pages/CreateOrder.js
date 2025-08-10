import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  Avatar,
  IconButton,
  Divider,
  Chip,
  Alert,
  Paper,
  CardMedia,
  Badge,
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCart,
  Person,
  Email,
  Phone,
  LocationOn,
  AttachMoney,
  Delete,
  CheckCircle,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { orderService, productService } from '../services/ecommerceApi';

const CreateOrder = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data.results || data);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = () => {
    if (!selectedProduct) {
      toast.warning('Please select a product');
      return;
    }

    if (quantity <= 0) {
      toast.warning('Please enter a valid quantity');
      return;
    }

    if (quantity > selectedProduct.stock_quantity) {
      toast.error(`Only ${selectedProduct.stock_quantity} items available in stock`);
      return;
    }

    const existingItem = cartItems.find(item => item.product.id === selectedProduct.id);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > selectedProduct.stock_quantity) {
        toast.error(`Cannot add more items. Only ${selectedProduct.stock_quantity} available`);
        return;
      }
      setCartItems(cartItems.map(item =>
        item.product.id === selectedProduct.id
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      setCartItems([...cartItems, { product: selectedProduct, quantity }]);
    }

    setSelectedProduct(null);
    setQuantity(1);
    toast.success('Product added to cart!');
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock_quantity) {
      toast.error(`Only ${product.stock_quantity} items available`);
      return;
    }

    setCartItems(cartItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
    toast.info('Product removed from cart');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    ).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Please add items to cart');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast.error('Please fill in all customer information');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        shipping_address: customerInfo.address,
        items: cartItems.map(item => ({
          product: item.product.id,
          quantity: item.quantity
        }))
      };

      await orderService.createOrder(orderData);
      toast.success('Order created successfully!');
      
      // Reset form
      setCartItems([]);
      setCustomerInfo({ name: '', email: '', phone: '', address: '' });
    } catch (error) {
      toast.error('Failed to create order');
      console.error('Order creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={8} sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
          textAlign: 'center'
        }}>
          <Typography variant="h3" component="h1" fontWeight="bold" 
            sx={{ 
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}>
            🛍️ KartFlow - Create Order
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Professional E-commerce Order Management System
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {/* Product Selection */}
          <Grid item xs={12} md={6}>
            <Card elevation={8} sx={{ 
              height: 'fit-content',
              borderRadius: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Add Products to Cart
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) => `${option.name} - $${option.price}`}
                    value={selectedProduct}
                    onChange={(_, newValue) => setSelectedProduct(newValue)}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                        <Avatar
                          src={option.image_url || 'https://via.placeholder.com/40'}
                          sx={{ mr: 2, width: 40, height: 40 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {option.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${option.price} • Stock: {option.stock_quantity}
                          </Typography>
                        </Box>
                        <Chip
                          label={option.category || 'General'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="🔍 Search Products"
                        variant="outlined"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    )}
                  />

                  {selectedProduct && (
                    <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={selectedProduct.image_url}
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {selectedProduct.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${selectedProduct.price} • Available: {selectedProduct.stock_quantity}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                        <TextField
                          type="number"
                          label="Quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          inputProps={{ min: 1, max: selectedProduct.stock_quantity }}
                          sx={{ width: 120 }}
                        />
                        <Button
                          variant="contained"
                          onClick={addToCart}
                          sx={{ 
                            borderRadius: 2,
                            px: 3,
                            background: 'linear-gradient(45deg, #4CAF50, #45a049)'
                          }}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card elevation={8} sx={{ 
              mt: 3,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Customer Information
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      required
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="email"
                      label="Email Address"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      required
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      required
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Shipping Address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      required
                      InputProps={{
                        startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Cart & Order Summary */}
          <Grid item xs={12} md={6}>
            <Card elevation={8} sx={{ 
              borderRadius: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    Shopping Cart
                  </Typography>
                  <Badge badgeContent={cartItems.length} color="primary">
                    <ShoppingCart />
                  </Badge>
                </Box>

                {cartItems.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ShoppingCart sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Your cart is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add some products to get started
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {cartItems.map((item, index) => (
                      <Card key={item.product.id} elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CardMedia
                              component="img"
                              sx={{ width: 60, height: 60, borderRadius: 1, mr: 2 }}
                              image={item.product.image_url || 'https://via.placeholder.com/60'}
                              alt={item.product.name}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {item.product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                ${item.product.price} each
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                sx={{ backgroundColor: '#f5f5f5' }}
                              >
                                <Remove />
                              </IconButton>
                              <Typography variant="body1" fontWeight="bold" sx={{ minWidth: 30, textAlign: 'center' }}>
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                sx={{ backgroundColor: '#f5f5f5' }}
                              >
                                <Add />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => removeFromCart(item.product.id)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              Subtotal:
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    {/* Order Total */}
                    <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                          Total Amount:
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                          <AttachMoney sx={{ verticalAlign: 'middle' }} />
                          {calculateTotal()}
                        </Typography>
                      </Box>
                      
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                          py: 2,
                          borderRadius: 2,
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {loading ? 'Creating Order...' : 'Place Order'}
                        <CheckCircle sx={{ ml: 1 }} />
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateOrder;
