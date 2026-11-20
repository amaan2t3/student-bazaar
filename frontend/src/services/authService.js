import api from './api';

export const authService = {
  // Login with email & password
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Login failed. Please check your credentials.';
    }
  },

  // Register new student account
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Registration failed. Please try again.';
    }
  },

  // Fetch current user
  async getMe() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to fetch user session.';
    }
  },

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/update-profile', profileData);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to update profile.';
    }
  }
};

export default authService;
