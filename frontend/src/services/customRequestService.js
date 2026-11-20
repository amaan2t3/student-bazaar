import api from './api';

export const customRequestService = {
  // Buyer creates custom request
  async create(requestData) {
    try {
      const response = await api.post('/custom-requests', requestData);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to submit custom project request.';
    }
  },

  // Buyer views own requests
  async getMyRequests() {
    try {
      const response = await api.get('/custom-requests/my-requests');
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load your custom requests.';
    }
  },

  // Seller views open feed
  async getFeed(params = {}) {
    try {
      const response = await api.get('/custom-requests/feed', { params });
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load opportunities feed.';
    }
  },

  // View single request
  async getSingle(id) {
    try {
      const response = await api.get(`/custom-requests/${id}`);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load request details.';
    }
  },

  // Admin moderation queue
  async getAdminQueue() {
    try {
      const response = await api.get('/custom-requests/admin/moderation');
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load moderation queue.';
    }
  },

  // Admin approves or cancels request
  async moderate(id, status, admin_feedback) {
    try {
      const response = await api.put(`/custom-requests/admin/${id}/moderate`, {
        status,
        admin_feedback
      });
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to update request status.';
    }
  }
};

export default customRequestService;
