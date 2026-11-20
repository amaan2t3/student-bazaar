import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sb_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('sb_token') || null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync session to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('sb_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sb_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('sb_token', token);
    } else {
      localStorage.removeItem('sb_token');
    }
  }, [token]);

  // Real login action via authService
  const loginWithCredentials = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authService.login(email, password);
      const authenticatedUser = result.data.user;
      const sessionToken = result.data.token;
      
      setUser(authenticatedUser);
      setToken(sessionToken);
      setLoading(false);
      return authenticatedUser;
    } catch (err) {
      setLoading(false);
      setAuthError(typeof err === 'string' ? err : 'Invalid login credentials.');
      throw err;
    }
  };

  // Real register action via authService
  const registerUser = async (formData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await authService.register(formData);
      const registeredUser = result.data.user;
      const sessionToken = result.data.token;

      if (sessionToken) {
        setUser(registeredUser);
        setToken(sessionToken);
      }
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setAuthError(typeof err === 'string' ? err : 'Registration failed.');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sb_user');
    localStorage.removeItem('sb_token');
  };

  // Quick Persona Switcher for Evaluation and Testing
  const switchRole = (newRole) => {
    if (newRole === 'guest') {
      logout();
      return;
    }

    const mockRoles = {
      buyer: {
        id: 'usr-buyer-01',
        full_name: 'Ali Raza',
        email: 'ali.raza@student.edu.pk',
        role: 'buyer',
        university: 'FAST-NUCES Lahore',
        degree: 'BSIT',
        semester: 4,
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        wallet_balance: 12500,
        escrow_balance: 5000
      },
      seller: {
        id: 'usr-seller-01',
        full_name: 'Muhammad Usman (Seller)',
        email: 'usman.dev@student.edu.pk',
        role: 'seller',
        university: 'PUCIT Lahore',
        degree: 'BSCS',
        semester: 7,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        wallet_balance: 48500,
        escrow_balance: 11000
      },
      admin: {
        id: 'usr-admin-01',
        full_name: 'Prof. Tariq Mahmood (Admin)',
        email: 'admin@studentbazaar.pk',
        role: 'admin',
        university: 'Platform Operations',
        degree: 'Faculty / Admin',
        semester: 8,
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
        wallet_balance: 0,
        escrow_balance: 0
      }
    };

    const targetUser = mockRoles[newRole] || mockRoles.buyer;
    setUser(targetUser);
    setToken(`mock-token-${targetUser.role}`);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      role: user?.role || 'guest',
      loading,
      authError,
      setAuthError,
      loginWithCredentials,
      registerUser,
      logout,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
