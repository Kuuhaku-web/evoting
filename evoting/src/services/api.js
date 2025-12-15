import axios from 'axios';

// Ambil base URL dari environment variable atau default ke Vercel URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://evoting-git-main-edwins-projects-0fa94835.vercel.app';

console.log('API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tambah token ke request jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
