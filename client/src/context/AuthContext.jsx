import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      if (user && user.role === 'student') {
        const { data } = await API.get('/portfolio/mine');
        setPortfolio(data);
      } else {
        setPortfolio(null);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setPortfolio(null);
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch portfolio.');
        setPortfolio(null); // Ensure portfolio is null on other errors too
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
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
      console.log('Login response data:', data);
      console.log('User role:', data.role);
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
    toast.info('Logged out');
  };

  const isAuthenticated = !!user;
  const role = user?.role;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      role,
      loading,
      portfolio,
      fetchPortfolio,
      login,
      register,
      logout,
      setUser // For updating user profile info directly after settings update
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);