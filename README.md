# E-commerce Kafka System - Frontend

A modern React frontend for the E-commerce Kafka System, providing a comprehensive user interface for managing products, orders, and inventory in real-time.

## 🚀 Features

### 📊 Dashboard
- **Real-time Analytics**: Order statistics and inventory metrics
- **Interactive Charts**: Pie charts for order status distribution, bar charts for inventory overview
- **Key Performance Indicators**: Total orders, revenue, inventory alerts
- **System Overview**: Quick insights into system performance

### 📦 Product Management
- **Product Catalog**: Grid view of all products with search functionality
- **CRUD Operations**: Create, read, update, and delete products
- **Stock Monitoring**: Real-time stock level indicators
- **Product Details**: Comprehensive product information with SKU tracking

### 🛒 Order Management
- **Order Dashboard**: Complete order listing with status tracking
- **Order Creation**: Interactive order builder with product selection
- **Order Details**: Comprehensive order view with item breakdown
- **Status Management**: Update order status with workflow validation
- **Order Tracking**: Timeline view of order progression

### 📋 Inventory Management
- **Real-time Stock Tracking**: Live inventory levels and availability
- **Stock Movements**: Track all inventory transactions
- **Low Stock Alerts**: Visual indicators for items requiring restocking
- **Bulk Operations**: Update stock levels with movement tracking
- **Location Management**: Track inventory across different locations

## 🛠️ Technology Stack

- **React 18**: Modern React with functional components and hooks
- **Material-UI (MUI)**: Professional UI component library
- **React Router**: Client-side routing for single-page application
- **Axios**: HTTP client for API communication
- **Recharts**: Beautiful, composable charts for analytics
- **React Toastify**: Elegant notification system

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   └── Layout/
│       └── Navbar.js    # Navigation component
├── pages/               # Page components
│   ├── Dashboard.js     # Analytics dashboard
│   ├── Products.js      # Product management
│   ├── Orders.js        # Order listing
│   ├── OrderDetails.js  # Order detail view
│   ├── CreateOrder.js   # Order creation
│   └── Inventory.js     # Inventory management
├── services/            # API service layer
│   ├── api.js          # Axios configuration
│   └── ecommerceApi.js # API service methods
├── App.js              # Main application component
└── index.js            # Application entry point
```

## 🚦 Getting Started

### Prerequisites
- Node.js 14.x or higher
- npm or yarn package manager
- Backend Django server running on http://localhost:8000

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 🔧 Configuration

### API Configuration
The frontend is configured to communicate with the Django backend API. Update the API base URL in `src/services/api.js` if needed:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

## 📱 Key Features Walkthrough

### 1. Dashboard Analytics
- **Order Distribution**: Visual representation of order statuses
- **Inventory Overview**: Stock levels and alerts
- **Revenue Tracking**: Real-time financial metrics
- **System Health**: Quick overview of system performance

### 2. Product Management
- **Add New Products**: Form-based product creation
- **Edit Products**: In-place editing with validation
- **Stock Checking**: Real-time availability verification
- **Search & Filter**: Find products quickly by name or SKU

### 3. Order Processing
- **Create Orders**: Interactive order builder
  - Product selection with autocomplete
  - Quantity management with stock validation
  - Shipping address collection
  - Real-time total calculation
- **Order Tracking**: Complete order lifecycle management
- **Status Updates**: Workflow-based status transitions

### 4. Inventory Control
- **Stock Movements**: Track all inventory changes
- **Movement Types**: In, Out, Reserved, Released, Adjustment
- **Low Stock Alerts**: Visual indicators for restocking needs
- **Batch Updates**: Efficient stock level management

## 📊 Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
