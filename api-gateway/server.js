const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Base URLs for each microservice
const AUTH_SERVICE_URL = 'http://localhost:3001';
const USER_SERVICE_URL = 'http://localhost:5000';
const ORDER_SERVICE_URL = 'http://localhost:3003';
const PRODUCT_SERVICE_URL = 'http://localhost:3004';

// Proxy request to Authentication Service
app.post('/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      message: error.response ? error.response.data.message : 'Internal Server Error'
    });
  }
});

// Proxy request to User Service
app.get('/users/:id', async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/users/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      message: error.response ? error.response.data.message : 'Internal Server Error'
    });
  }
});

// Proxy request to Order Service
app.get('/orders/:id', async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/orders/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      message: error.response ? error.response.data.message : 'Internal Server Error'
    });
  }
});

// Proxy request to Product Service
app.get('/products/:id', async (req, res) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      message: error.response ? error.response.data.message : 'Internal Server Error'
    });
  }
});

// Start the API Gateway
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
