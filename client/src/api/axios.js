import axios from 'axios';

const API = axios.create({
  baseURL: 'https://portfolix-lnja.onrender.com/api',
  withCredentials: true,
});

// Attach JWT from localStorage on every request
API.interceptors.request.use(
  (req) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed?.token) {
          req.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch {
        // corrupted localStorage – ignore
      }
    }

    // Let the browser set the correct multipart boundary for FormData
    if (req.data instanceof FormData) {
      delete req.headers['Content-Type'];
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// Centralised response handler for auth failures
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    // Token expired / invalid / missing → force logout and redirect
    if (
      status === 401 &&
      (code === 'TOKEN_EXPIRED' ||
        code === 'TOKEN_INVALID' ||
        code === 'TOKEN_FAILED' ||
        code === 'NO_TOKEN' ||
        code === 'USER_NOT_FOUND' ||
        // fallback for older backend responses that only have a message
        error.response?.data?.message?.toLowerCase?.().includes('token') ||
        error.response?.data?.message?.toLowerCase?.().includes('authorized'))
    ) {
      // Avoid infinite redirect loops if already on login page
      const isAuthPage =
        window.location.pathname === '/login' ||
        window.location.pathname === '/register';

      localStorage.removeItem('userInfo');

      if (!isAuthPage) {
        // Small delay so any toast can still fire if a component wants to show one
        setTimeout(() => {
          window.location.href = '/login?session=expired';
        }, 100);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
