// src/services/api.js
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, '');

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('fitbox_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      localStorage.removeItem('fitbox_token');
      window.location.href = '/';
      throw new Error('Unauthorized');
    }

    return response;
  } catch (error) {
    if (error.message === 'Unauthorized') {
      throw error;
    }
    throw new Error('Network error');
  }
};

export const isTokenValid = () => {
  const token = localStorage.getItem('fitbox_token');
  return !!token;
};