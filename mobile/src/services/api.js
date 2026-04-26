import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Auto-detect the correct backend URL
const getApiUrl = () => {
  // For Web browser
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }
  
  // For Android Emulator
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  
  // For iOS Simulator
  if (Platform.OS === 'ios') {
    return 'http://localhost:5000/api';
  }
  
  // For physical device - CHANGE THIS TO YOUR COMPUTER'S IP
  // Run 'ipconfig' in cmd to find your IPv4 address
  return 'http://192.168.16.192:5000/api'; // <-- CHANGE THIS IP
};

const API_URL = getApiUrl();

console.log('🌐 API URL:', API_URL); // This will help debug

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Task APIs
export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.put(`/tasks/${taskId}/status`, { status });
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export default api;