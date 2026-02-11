import api from './api';

export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    },

    getRequestLogs: async (page = 0, size = 50, appId = null, type = null) => {
        const params = { page, size };
        if (appId) params.appId = appId;
        if (type) params.type = type;

        const response = await api.get('/admin/dashboard/request-logs', { params });
        return response.data;
    }
};

export default dashboardService;
