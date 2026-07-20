import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('ecart_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('ecart_token'));
  const [loading, setLoading] = useState(true);

  // On mount — re-validate the stored token with the backend
  useEffect(() => {
    const verify = async () => {
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          localStorage.setItem('ecart_user', JSON.stringify(userData));
        } catch {
          // Token is expired or invalid — clear everything
          _clear();
        }
      }
      setLoading(false);
    };
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);   // run once on mount only

  const _clear = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ecart_token');
    localStorage.removeItem('ecart_user');
    localStorage.removeItem('ecart_cart_count');
  };

  // Real backend login — returns a JWT
  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const userData = {
      userId:   res.userId,
      fullName: res.fullName,
      email:    res.email,
      role:     res.role,
    };
    setToken(res.token);
    setUser(userData);
    localStorage.setItem('ecart_token', res.token);
    localStorage.setItem('ecart_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => _clear();

  const isAuthenticated   = !!token;
  const isAdmin           = user?.role === 'ADMIN';
  const isSeller          = user?.role === 'SELLER';
  const isServiceProvider = user?.role === 'SERVICE_PROVIDER';
  const isCustomer        = user?.role === 'CUSTOMER';

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAuthenticated, isAdmin, isSeller, isServiceProvider, isCustomer,
      login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
