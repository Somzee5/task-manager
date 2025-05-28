import axios from 'axios'; // Assuming you are using axios

// This environment variable will be set on Render for production,
// and will default to localhost:5000 for local development.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add interceptors here for things like auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Or wherever you store your token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// Example usage (you would export functions that make specific API calls)
// export const getTasks = () => api.get('/api/tasks');
// export const loginUser = (credentials) => api.post('/api/auth/login', credentials);

export default api; // Export the configured axios instance