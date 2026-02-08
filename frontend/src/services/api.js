import axios from 'axios';
import env from '../config/env';

const api = axios.create({
    baseURL: `${env.apiBaseUrl}/api`,
    timeout: env.apiTimeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const apiKey = config.headers['X-API-KEY'];

        if (apiKey) {
            // Priority to application user token if apiKey is present
            // We use the apiKey (which serves as appId) to namespace the token
            const userToken = localStorage.getItem(`userToken_${apiKey}`);
            if (userToken) {
                config.headers['Authorization'] = `Bearer ${userToken}`;
            }
        } else {
            // Default to client/platform token
            const token = localStorage.getItem('clientToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const config = error.config;
        const isAppLevel = !!config?.headers['X-API-KEY'];

        if (error.response?.status === 401 && !isAppLevel) {
            localStorage.removeItem('clientToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
