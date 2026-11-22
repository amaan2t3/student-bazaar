import api from './api';

export const contactService = {
  // Public
  async submitMessage(formData) {
    try {
      const response = await api.post('/contact/messages', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to submit contact message.';
    }
  },

  async getContactInfo() {
    try {
      const response = await api.get('/contact/info');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to load contact information.';
    }
  },

  // Admin
  async getAdminMessages(params = {}) {
    try {
      const response = await api.get('/contact/admin/messages', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch contact messages.';
    }
  },

  async getAdminMessageById(id) {
    try {
      const response = await api.get(`/contact/admin/messages/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch message details.';
    }
  },

  async updateMessageStatus(id, updateData) {
    try {
      const response = await api.patch(`/contact/admin/messages/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update message status.';
    }
  },

  async deleteMessage(id) {
    try {
      const response = await api.delete(`/contact/admin/messages/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete message.';
    }
  },

  async getAdminContactSettings() {
    try {
      const response = await api.get('/contact/admin/settings');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to load contact settings.';
    }
  },

  async updateContactSettings(settingsData) {
    try {
      const response = await api.put('/contact/admin/settings', settingsData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update contact settings.';
    }
  }
};

export default contactService;
