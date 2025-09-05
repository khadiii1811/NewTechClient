import axios from "axios";

const API_URL = "http://localhost:5070/api/auth";

// JWT token management
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpires');
};

// Decode JWT token to get user info
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  // First check if we have server-provided expiration time
  const serverExpires = localStorage.getItem('tokenExpires');
  if (serverExpires) {
    const expirationTime = new Date(serverExpires).getTime();
    const currentTime = Date.now();
    if (currentTime >= expirationTime) {
      return true;
    }
  }
  
  // Fallback to JWT token expiration
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Get current user from token
const getCurrentUser = () => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    removeToken();
    return null;
  }
  
  const decoded = decodeToken(token);
  console.log('Decoded JWT token:', decoded); // Debug log
  
  return decoded ? {
    id: decoded.nameid || decoded.sub || decoded.id,
    username: decoded.unique_name || decoded.username,
    role: Array.isArray(decoded.role) ? decoded.role[0] : decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
  } : null;
};

// Login function
const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password
    });
    
    const authResponse = response.data; // AuthResponseDto
    const { token, expires, user } = authResponse;
    
    if (token) {
      setToken(token);
      
      // Store token expiration time for better management
      if (expires) {
        localStorage.setItem('tokenExpires', expires);
      }
      
      return { 
        success: true, 
        user: user || getCurrentUser(), // Use user from response or decode from token
        token: token,
        expires: expires
      };
    }
    
    return { success: false, message: 'No token received' };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || error.response?.data || 'Login failed' 
    };
  }
};

// Logout function
const logout = () => {
  removeToken();
  window.location.href = '/login';
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};

// Check if user has specific role
const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  return user && user.role === requiredRole;
};

// Setup axios interceptor to add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Setup axios interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  getToken,
  setToken,
  removeToken
};
