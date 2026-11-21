import api from './api';
import { isSupabaseConfigured, supabase } from './supabase';

const requireSupabase = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Authentication is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
};

const getApiError = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export const authService = {
  async login(email, password) {
    requireSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error) throw new Error(error.message);
    if (!data.session) throw new Error('Unable to create an authenticated session.');
    return data.session;
  },

  async register(userData) {
    requireSupabase();
    const { data, error } = await supabase.auth.signUp({
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name.trim(),
          university: userData.university.trim(),
          degree: userData.degree,
          semester: Number(userData.semester)
        },
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (error) throw new Error(error.message);
    return {
      session: data.session,
      requiresEmailConfirmation: !data.session
    };
  },

  async getMe(accessToken) {
    try {
      const response = await api.get('/auth/me', accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : undefined);
      return response.data.data.user;
    } catch (error) {
      throw new Error(getApiError(error, 'Failed to load your account profile.'));
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/update-profile', profileData);
      return response.data.data.user;
    } catch (error) {
      throw new Error(getApiError(error, 'Failed to update profile.'));
    }
  },

  async requestPasswordReset(email) {
    requireSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/login`
    });
    if (error) throw new Error(error.message);
  }
};

export default authService;
