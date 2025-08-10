import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
} from '@mui/material';
import { Search, Add, Edit, Inventory, ShoppingCart, Category } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { productService } from '../services/ecommerceApi';

const ProductCard = ({ product, onEdit, onCheckStock }) => (
  <Card elevation={6} sx={{ 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column',
    borderRadius: 3,
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
    }
  }}>
    <CardMedia
      component="img"
      height="200"
      image={product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
      alt={product.name}
      sx={{ objectFit: 'cover' }}
    />
    <CardContent sx={{ flexGrow: 1, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" component="div" fontWeight="bold" noWrap sx={{ flexGrow: 1 }}>
          {product.name}
        </Typography>
        {product.category && (
          <Chip
            icon={<Category />}
            label={product.category}
            size="small"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        )}
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ 
        mb: 2, 
        height: '3em', 
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {product.description}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" color="primary" fontWeight="bold">
          ${product.price}
        </Typography>
        <Badge
          badgeContent={product.stock_quantity}
          color={product.stock_quantity > 10 ? 'success' : product.stock_quantity > 0 ? 'warning' : 'error'}
          max={999}
        >
          <Inventory color="action" />
        </Badge>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          backgroundColor: '#f5f5f5',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontFamily: 'monospace'
        }}>
          SKU: {product.sku}
        </Typography>
        <Chip
          label={product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
          color={product.stock_quantity > 0 ? 'success' : 'error'}
          size="small"
          variant="filled"
        />
      </Box>
    </CardContent>
    <CardActions sx={{ p: 2, pt: 0 }}>
      <Button 
        size="small" 
        startIcon={<Edit />} 
        onClick={() => onEdit(product)}
        variant="outlined"
        sx={{ borderRadius: 2 }}
      >
        Edit
      </Button>
      <Button 
        size="small" 
        startIcon={<Inventory />} 
        onClick={() => onCheckStock(product)}
        variant="outlined"
        sx={{ borderRadius: 2 }}
      >
        Stock
      </Button>
    </CardActions>
  </Card>
);

const ProductForm = ({ open, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    sku: '',
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        sku: '',
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
        <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Product Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.price}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
          <TextField
            margin="dense"
            name="stock_quantity"
            label="Stock Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="sku"
            label="SKU"
            fullWidth
            variant="outlined"
            value={formData.sku}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {product ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data.results || data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Products fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(productData);
        toast.success('Product created successfully!');
      }
      setFormOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to save product');
      console.error('Product save error:', err);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleCheckStock = async (product) => {
    try {
      const availability = await productService.checkAvailability(product.id, 1);
      toast.info(`${product.name}: ${availability.available_quantity} units available`);
    } catch (err) {
      toast.error('Failed to check stock');
      console.error('Stock check error:', err);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Box sx={{ 
          textAlign: 'center',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 3,
          p: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Loading products...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pt: 2,
      pb: 4
    }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 3,
          p: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
            🛍️ Products Collection
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setFormOpen(true)}
            size="large"
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Add Product
          </Button>
        </Box>

        <Box sx={{ 
          mb: 4,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 3,
          p: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="🔍 Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'white',
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#764ba2',
                },
              },
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard
                product={product}
                onEdit={handleEditProduct}
                onCheckStock={handleCheckStock}
              />
            </Grid>
          ))}
        </Grid>

        {filteredProducts.length === 0 && !loading && (
          <Box sx={{ 
            textAlign: 'center', 
            mt: 6,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: 3,
            p: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <Typography variant="h4" color="textSecondary" gutterBottom>
              📦
            </Typography>
            <Typography variant="h6" color="textSecondary">
              No products found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Try adjusting your search or add a new product to get started
            </Typography>
          </Box>
        )}

        <ProductForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onSave={handleSaveProduct}
        />
      </Container>
    </Box>
  );
};

export default Products;
