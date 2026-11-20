import api from './api';

export const projectService = {
  // Public catalog query
  async getProjects(params = {}) {
    try {
      const response = await api.get('/projects', { params });
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load projects.';
    }
  },

  // Public project details
  async getProjectBySlug(slug) {
    try {
      const response = await api.get(`/projects/detail/${slug}`);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load project details.';
    }
  },

  // Seller creates new listing
  async createProject(projectData) {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to submit project listing.';
    }
  },

  // Seller gets own listings
  async getSellerProjects() {
    try {
      const response = await api.get('/projects/seller/my-projects');
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load seller projects.';
    }
  },

  // Admin moderation queue
  async getAdminModerationQueue() {
    try {
      const response = await api.get('/projects/admin/moderation');
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to load moderation queue.';
    }
  },

  // Admin approves or rejects
  async moderateProject(id, status, moderation_feedback) {
    try {
      const response = await api.put(`/projects/admin/${id}/moderate`, {
        status,
        moderation_feedback
      });
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to update project status.';
    }
  }
};

export default projectService;
