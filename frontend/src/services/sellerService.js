import api from './api';

export const sellerService = {
  // Submit new seller application
  async apply(applicationData) {
    try {
      const response = await api.post('/sellers/apply', applicationData);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to submit seller application.';
    }
  },

  // Get current user's application status
  async getMyApplication() {
    try {
      const response = await api.get('/sellers/my-application');
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to retrieve application.';
    }
  },

  // Admin: Get all applications
  async getAdminApplications() {
    try {
      const response = await api.get('/sellers/admin/applications');
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load seller applications.';
    }
  },

  // Admin: Review (Approve or Reject)
  async reviewApplication(id, status, admin_feedback) {
    try {
      const response = await api.put(`/sellers/admin/applications/${id}/review`, {
        status,
        admin_feedback
      });
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to update application status.';
    }
  }
};

export default sellerService;
