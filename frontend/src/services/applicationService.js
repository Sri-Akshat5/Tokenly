import api from './api';

export const applicationService = {
    // List all applications
    list: async () => {
        const response = await api.get('/applications');
        return response.data;
    },

    // Get application details
    get: async (id) => {
        const response = await api.get(`/applications/${id}`);
        return response.data;
    },

    // Create application
    create: async (data) => {
        const response = await api.post('/applications', data);
        return response.data;
    },

    // Update application
    update: async (id, data) => {
        const response = await api.put(`/applications/${id}`, data);
        return response.data;
    },

    // Delete application
    delete: async (id) => {
        const response = await api.delete(`/applications/${id}`);
        return response.data;
    },

    // Get API endpoints documentation
    getEndpoints: async (id) => {
        const response = await api.get(`/applications/${id}/endpoints`);
        return response.data;
    },
};

export default applicationService;
