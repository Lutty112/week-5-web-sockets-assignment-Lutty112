import axios from 'axios';
import { io } from 'socket.io-client';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

export const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  withCredentials: true,
});

export default API;
