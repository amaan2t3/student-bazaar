import api from './api';

const getErrorMessage = (error, fallbackMessage) => {
  return error.response?.data?.message || fallbackMessage;
};

export const teamService = {
  // Public
  async getTeamMembers() {
    try {
      const response = await api.get('/team');
      return response.data;
    } catch (error) {
      throw getErrorMessage(error, 'Failed to fetch team members.');
    }
  },

  // Admin
  async getAdminTeamMembers() {
    try {
      const response = await api.get('/team/admin/all');
      return response.data;
    } catch (error) {
      throw getErrorMessage(error, 'Failed to fetch all team members.');
    }
  },

  async createTeamMember(memberData) {
    try {
      const response = await api.post('/team/admin', memberData);
      return response.data;
    } catch (error) {
      throw getErrorMessage(error, 'Failed to create team member.');
    }
  },

  async updateTeamMember(id, memberData) {
    try {
      const response = await api.put(`/team/admin/${id}`, memberData);
      return response.data;
    } catch (error) {
      throw getErrorMessage(error, 'Failed to update team member.');
    }
  },

  async deleteTeamMember(id) {
    try {
      const response = await api.delete(`/team/admin/${id}`);
      return response.data;
    } catch (error) {
      throw getErrorMessage(error, 'Failed to delete team member.');
    }
  }
};

export default teamService;
