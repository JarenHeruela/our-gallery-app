import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export const register = async (email, password) => {
  return await axios.post(`${API_URL}/register`, {username, email, password });
};

export const login = async (email, password) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};
