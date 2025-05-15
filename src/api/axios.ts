// src/api/zoomApi.ts
import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: 'http://localhost:4000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth data from localStorage for future API requests
export const setupApiAuth = (accessToken: string) => {
    if (accessToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;