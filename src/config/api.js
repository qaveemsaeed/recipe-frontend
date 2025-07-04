// API Configuration for different environments
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  
  // User endpoints
  USER_PROFILE: '/api/consumer/profile',
  USER_DATA: (userId) => `/api/consumer/user-data/${userId}`,
  
  // Cart endpoints
  CART: (userId) => `/api/cart/${userId}`,
  CART_ITEM: (userId, itemId) => `/api/cart/${userId}/${itemId}`,
  
  // Orders endpoints
  ORDERS: (userId) => `/api/orders/${userId}`,
  USER_ORDERS: (userId) => `/api/orders/user/${userId}`,
  CANCEL_ORDER: (orderId) => `/api/orders/${orderId}/cancel`,
  
  // Recipe/Food endpoints
  HOME_RECIPES: '/api/home',
  SEARCH: '/api/search',
  
  // Recipe detail
  RECIPE_DETAIL: (recipeId) => `/api/recipes/${recipeId}`,
};

// Helper function to create full API URLs
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_BASE_URL; 