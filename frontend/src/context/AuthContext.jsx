import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    let active = true;
    let profileRequest = 0;
    localStorage.removeItem('sb_user');
    localStorage.removeItem('sb_token');

    const syncSession = async (nextSession) => {
      const requestId = ++profileRequest;
      if (!active) return;

      setSession(nextSession);
      if (!nextSession) {
        setUser(null);
        setAuthError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const profile = await authService.getMe(nextSession.access_token);
        if (active && requestId === profileRequest) {
          setUser(profile);
          setAuthError(null);
        }
      } catch (error) {
        if (active && requestId === profileRequest) {
          setUser(null);
          setAuthError(error.message);
        }
      } finally {
        if (active && requestId === profileRequest) setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
      void syncSession(nextSession);
    });

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        void syncSession(data.session);
      })
      .catch((error) => {
        if (active) {
          setAuthError(error.message || 'Unable to restore your login session.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginWithCredentials = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const nextSession = await authService.login(email, password);
      const profile = await authService.getMe(nextSession.access_token);
      setSession(nextSession);
      setUser(profile);
      return profile;
    } catch (error) {
      const message = error.message || 'Login failed. Please check your credentials.';
      setAuthError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (formData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const registration = await authService.register(formData);
      if (registration.session) {
        const profile = await authService.getMe(registration.session.access_token);
        setSession(registration.session);
        setUser(profile);
      }
      return registration;
    } catch (error) {
      const message = error.message || 'Registration failed.';
      setAuthError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    setSession(null);
    setUser(null);
    setAuthError(null);
  };

  const requestPasswordReset = async (email) => {
    setAuthError(null);
    try {
      await authService.requestPasswordReset(email);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const updatePassword = async (password) => {
    setAuthError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setAuthError(signOutError.message);
      throw signOutError;
    }
    setSession(null);
    setUser(null);
    setRecoveryMode(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      token: session?.access_token || null,
      role: user?.role || 'guest',
      loading,
      authError,
      recoveryMode,
      setAuthError,
      loginWithCredentials,
      registerUser,
      requestPasswordReset,
      updatePassword,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
