import apiClient from './api';

export const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    const response = await apiClient.get('/products/', { params });
    return response.data;
  },

  // Get product by ID
  getProduct: async (id) => {
    const response = await apiClient.get(`/products/${id}/`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await apiClient.post('/products/', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}/`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}/`);
    return response.data;
  },

  // Check product availability
  checkAvailability: async (id, quantity) => {
    const response = await apiClient.get(`/products/${id}/check_availability/`, {
      params: { quantity }
    });
    return response.data;
  },
};

export const orderService = {
  // Get all orders
  getOrders: async (params = {}) => {
    const response = await apiClient.get('/orders/', { params });
    return response.data;
  },

  // Get order by ID
  getOrder: async (id) => {
    const response = await apiClient.get(`/orders/${id}/`);
    return response.data;
  },

  // Create new order
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders/', orderData);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    const response = await apiClient.patch(`/orders/${id}/update_status/`, { status });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await apiClient.post(`/orders/${id}/cancel/`);
    return response.data;
  },

  // Get user's orders
  getMyOrders: async () => {
    const response = await apiClient.get('/orders/my_orders/');
    return response.data;
  },

  // Get order statistics
  getOrderStats: async () => {
    const response = await apiClient.get('/orders/order_stats/');
    return response.data;
  },
};

export const inventoryService = {
  // Get all inventory items
  getInventoryItems: async (params = {}) => {
    const response = await apiClient.get('/inventory/', { params });
    return response.data;
  },

  // Get inventory item by ID
  getInventoryItem: async (id) => {
    const response = await apiClient.get(`/inventory/${id}/`);
    return response.data;
  },

  // Update stock
  updateStock: async (id, stockData) => {
    const response = await apiClient.post(`/inventory/${id}/update_stock/`, stockData);
    return response.data;
  },

  // Reserve stock
  reserveStock: async (id, reservationData) => {
    const response = await apiClient.post(`/inventory/${id}/reserve_stock/`, reservationData);
    return response.data;
  },

  // Release reservation
  releaseReservation: async (id, releaseData) => {
    const response = await apiClient.post(`/inventory/${id}/release_reservation/`, releaseData);
    return response.data;
  },

  // Get low stock items
  getLowStockItems: async () => {
    const response = await apiClient.get('/inventory/low_stock_items/');
    return response.data;
  },

  // Get inventory statistics
  getInventoryStats: async () => {
    const response = await apiClient.get('/inventory/inventory_stats/');
    return response.data;
  },

  // Get stock movements
  getStockMovements: async (params = {}) => {
    const response = await apiClient.get('/stock-movements/', { params });
    return response.data;
  },
};
