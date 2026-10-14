import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      if (user && user.role === 'student') {
        const { data } = await API.get('/portfolio/mine');
        setPortfolio(data);
      } else {
        setPortfolio(null);
      }
    } catch (error) {
      // 401 is already handled by the axios interceptor (clears session + redirects)
      if (error.response?.status === 404) {
        setPortfolio(null);
      } else if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || 'Failed to fetch portfolio.');
        setPortfolio(null);
      }
    }
  };

  // On app load: restore user from localStorage, then validate the token
  useEffect(() => {
    const initAuth = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(userInfo);
        if (!parsed?.token) {
          localStorage.removeItem('userInfo');
          setLoading(false);
          return;
        }

        // Optimistic set so UI doesn't flash login page
        setUser(parsed);

        // Validate token against the backend
        // If token is expired/invalid the axios interceptor will clear storage and redirect
        await API.get('/auth/me');
      } catch (err) {
        // Interceptor already handled 401; for any other error just clear
        if (err.response?.status !== 401) {
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    } else {
      setPortfolio(null);
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      toast.success('Logged in successfully!');
      return { success: true, user: data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, user: null };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await API.post('/auth/register', userData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setPortfolio(null);
    toast.info('Logged out');
  };

  const isAuthenticated = !!user;
  const role = user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        role,
        loading,
        portfolio,
        fetchPortfolio,
        login,
        register,
        logout,
        setUser, // For updating user profile info directly after settings update
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
