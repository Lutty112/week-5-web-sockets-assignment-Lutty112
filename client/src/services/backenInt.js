import axios from 'axios';
import { io } from 'socket.io-client';

const baseURL = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5000';

// Axios instance
const API = axios.create({
  baseURL: `${baseURL}/api`,
});

// Add Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Socket.io
export const socket = io(baseURL, {
  withCredentials: true,
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

export default API;
