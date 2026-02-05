import api from './api';

export const authService = {
    // Client signup
    signup: async (data) => {
        const response = await api.post('/clients/signup', data);
        return response.data;
    },

    // Client login
    login: async (email, password) => {
        const response = await api.post('/clients/login', { email, password });
        const clientData = response.data?.data; // ClientResponse object

        if (clientData?.token) {
            localStorage.setItem('clientToken', clientData.token);
            // Store client info (without token)
            const { token, ...client } = clientData;
            localStorage.setItem('client', JSON.stringify(client));
        }
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('clientToken');
        localStorage.removeItem('client');
        window.location.href = '/login';
    },

    // Get current client
    getCurrentClient: () => {
        const client = localStorage.getItem('client');
        return client ? JSON.parse(client) : null;
    },

    // Check if authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('clientToken');
    },
    // --- End-User Auth (Application Level) ---

    // Request Login OTP
    requestOtp: async (appId, email) => {
        const response = await api.post('/auth/request-otp', null, {
            params: { email },
            headers: { 'X-Application-Id': appId }
        });
        return response.data;
    },

    // Get Application Info (Public)
    getAppInfo: async (appId) => {
        const response = await api.get('/auth/app-info', {
            headers: { 'X-Application-Id': appId }
        });
        return response.data;
    },

    // Request Magic Link
    requestMagicLink: async (appId, email) => {
        const response = await api.post('/auth/request-magic-link', null, {
            params: { email },
            headers: { 'X-Application-Id': appId }
        });
        return response.data;
    },

    // Application User Login (Password, OTP, Magic Link, OAuth)
    userLogin: async (appId, data) => {
        const response = await api.post('/auth/login', data, {
            headers: { 'X-Application-Id': appId }
        });
        const userData = response.data?.data;
        if (userData?.accessToken) {
            localStorage.setItem(`userToken_${appId}`, userData.accessToken);
            if (userData.refreshToken) {
                localStorage.setItem(`userRefreshToken_${appId}`, userData.refreshToken);
            }
        }
        return response.data;
    },

    // Application User Signup
    userSignup: async (appId, data) => {
        const response = await api.post('/auth/signup', data, {
            headers: { 'X-Application-Id': appId }
        });
        return response.data;
    },

    // Check if user is authenticated for a specific app
    isUserAuthenticated: (appId) => {
        return !!localStorage.getItem(`userToken_${appId}`);
    },

    // Get app user profile
    getUserProfile: async (appId) => {
        const token = localStorage.getItem(`userToken_${appId}`);
        const response = await api.get('/auth/profile', {
            headers: {
                'X-Application-Id': appId,
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
};

export default authService;
