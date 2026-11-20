import api from './api';

export const orderService = {
  // Process checkout in PKR
  async checkout(orderData) {
    try {
      const response = await api.post('/orders/checkout', orderData);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Payment failed. Please try again.';
    }
  },

  // Get current user's purchased projects
  async getMyPurchases() {
    try {
      const response = await api.get('/orders/my-purchases');
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load purchased packages.';
    }
  },

  // Request temporary signed download URL (15m validity)
  async getSecureDownloadUrl(projectId) {
    try {
      const response = await api.get(`/orders/downloads/${projectId}`);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to generate secure download link.';
    }
  }
};

export default orderService;
