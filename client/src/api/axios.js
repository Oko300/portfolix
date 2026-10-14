import axios from 'axios';

const API = axios.create({
  baseURL: 'https://portfolix-lnja.onrender.com/api',
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`;
  }

  // Let the browser set the correct multipart/form-data boundary for FormData
  if (req.data instanceof FormData) {
    delete req.headers['Content-Type'];
  }

  return req;
});

export default API;
