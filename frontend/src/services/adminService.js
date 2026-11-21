import api from './api';

export const adminService = {
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard-stats');
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to load dashboard totals.';
    }
  }
};

export default adminService;
