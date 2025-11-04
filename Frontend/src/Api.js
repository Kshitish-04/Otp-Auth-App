import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/auth',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add request interceptor for debugging
API.interceptors.request.use(
    (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
API.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('Response Error:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default API; 